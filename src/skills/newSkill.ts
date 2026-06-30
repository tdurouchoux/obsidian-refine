import type { Plugin } from "obsidian";
import { buildSkillTemplate } from "./skillTemplate";
import { ensureFolder } from "./ensureFolder";

export async function createUntitledSkill(plugin: Plugin, skillsFolder: string): Promise<void> {
	const vault = plugin.app.vault;

	await ensureFolder(vault, skillsFolder);

	let fileName = "Untitled.md";
	let suffix = 1;
	while (vault.getAbstractFileByPath(`${skillsFolder}/${fileName}`)) {
		fileName = `Untitled ${suffix}.md`;
		suffix += 1;
	}

	const path = `${skillsFolder}/${fileName}`;
	const file = await vault.create(path, buildSkillTemplate());
	await plugin.app.workspace.getLeaf(false).openFile(file);
}
