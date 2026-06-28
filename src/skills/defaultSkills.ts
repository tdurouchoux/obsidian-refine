import type { Plugin } from "obsidian";
import { ensureFolder } from "./ensureFolder";
import makeFormal from "./defaults/make-formal.md";
import simplify from "./defaults/simplify.md";
import fixGrammar from "./defaults/fix-grammar.md";
import makeConcise from "./defaults/make-concise.md";
import expand from "./defaults/expand.md";
import makeCasual from "./defaults/make-casual.md";
import summarise from "./defaults/summarise.md";

const DEFAULT_SKILL_FILES: Array<{ fileName: string; content: string }> = [
	{ fileName: "make-formal.md", content: makeFormal },
	{ fileName: "simplify.md", content: simplify },
	{ fileName: "fix-grammar.md", content: fixGrammar },
	{ fileName: "make-concise.md", content: makeConcise },
	{ fileName: "expand.md", content: expand },
	{ fileName: "make-casual.md", content: makeCasual },
	{ fileName: "summarise.md", content: summarise },
];

export async function ensureDefaultSkills(plugin: Plugin, skillsFolder: string): Promise<void> {
	const vault = plugin.app.vault;

	await ensureFolder(vault, skillsFolder);

	for (const { fileName, content } of DEFAULT_SKILL_FILES) {
		const path = `${skillsFolder}/${fileName}`;
		if (vault.getAbstractFileByPath(path)) continue;
		try {
			await vault.create(path, content);
		} catch (error) {
			if (!(error as Error).message?.includes("already exists")) throw error;
		}
	}
}
