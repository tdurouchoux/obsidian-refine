import { describe, expect, it } from "vitest";
import { buildMessages } from "./promptBuilder";
import type { Skill } from "../types";

const skill: Skill = {
	filePath: "Refine/Skills/make-formal.md",
	fileBaseName: "make-formal",
	name: "Make Formal",
	description: "Rewrites text formally.",
	primary: true,
	systemPrompt: "Rewrite formally.\nPreserve meaning.",
};

describe("buildMessages", () => {
	it("returns exactly a system and a user message", () => {
		const messages = buildMessages(skill, "  hey can u send the doc  ");
		expect(messages).toHaveLength(2);
		expect(messages[0]).toEqual({ role: "system", content: "Rewrite formally.\nPreserve meaning." });
		expect(messages[1]).toEqual({ role: "user", content: "  hey can u send the doc  " });
	});

	it("preserves selected text verbatim, without trimming", () => {
		const messages = buildMessages(skill, "\nleading and trailing\n");
		expect(messages[1].content).toBe("\nleading and trailing\n");
	});
});
