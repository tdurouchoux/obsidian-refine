import { describe, expect, it } from "vitest";
import { parseSkillFile } from "./parser";

const VALID_SKILL = `---
name: Make Formal
description: Rewrites text in a formal tone.
icon: 🎩
primary: true
order: 1
model: gpt-4o
temperature: 0.3
---

# Make Formal

## Instructions
Rewrite formally.
`;

describe("parseSkillFile", () => {
	it("parses a valid skill file", () => {
		const skill = parseSkillFile(VALID_SKILL, "Refine/Skills/make-formal.md");
		expect(skill).not.toBeNull();
		expect(skill?.name).toBe("Make Formal");
		expect(skill?.description).toBe("Rewrites text in a formal tone.");
		expect(skill?.icon).toBe("🎩");
		expect(skill?.primary).toBe(true);
		expect(skill?.order).toBe(1);
		expect(skill?.model).toBe("gpt-4o");
		expect(skill?.temperature).toBe(0.3);
		expect(skill?.fileBaseName).toBe("make-formal");
		expect(skill?.systemPrompt).toBe("# Make Formal\n\n## Instructions\nRewrite formally.");
	});

	it("returns null when name is missing", () => {
		const raw = `---\ndescription: Some description\n---\nBody`;
		expect(parseSkillFile(raw, "skill.md")).toBeNull();
	});

	it("returns null when description is missing", () => {
		const raw = `---\nname: Some Skill\n---\nBody`;
		expect(parseSkillFile(raw, "skill.md")).toBeNull();
	});

	it("returns null for malformed YAML", () => {
		const raw = `---\nname: [unterminated\n---\nBody`;
		expect(parseSkillFile(raw, "skill.md")).toBeNull();
	});

	it("returns null when there is no frontmatter", () => {
		const raw = `# Just a heading\n\nNo frontmatter here.`;
		expect(parseSkillFile(raw, "skill.md")).toBeNull();
	});

	it("applies defaults for missing optional fields", () => {
		const raw = `---\nname: Minimal\ndescription: A minimal skill.\n---\nBody`;
		const skill = parseSkillFile(raw, "skill.md");
		expect(skill?.primary).toBe(false);
		expect(skill?.order).toBeUndefined();
		expect(skill?.icon).toBeUndefined();
		expect(skill?.model).toBeUndefined();
		expect(skill?.temperature).toBeUndefined();
	});

	it("treats a non-boolean primary string as false", () => {
		const raw = `---\nname: Minimal\ndescription: A minimal skill.\nprimary: "true"\n---\nBody`;
		const skill = parseSkillFile(raw, "skill.md");
		expect(skill?.primary).toBe(false);
	});
});
