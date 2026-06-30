import { describe, expect, it } from "vitest";
import { SkillRegistry } from "./registry";
import type { Skill } from "../types";

function makeSkill(overrides: Partial<Skill>): Skill {
	return {
		filePath: overrides.filePath ?? `${overrides.fileBaseName}.md`,
		fileBaseName: "skill",
		name: "Skill",
		description: "A skill.",
		primary: false,
		systemPrompt: "Do something.",
		...overrides,
	};
}

describe("SkillRegistry", () => {
	it("sorts primary skills by order, then by filename", () => {
		const registry = new SkillRegistry();
		registry.set("c.md", makeSkill({ fileBaseName: "c", name: "C", primary: true, order: 2 }));
		registry.set("a.md", makeSkill({ fileBaseName: "a", name: "A", primary: true, order: 1 }));
		registry.set("z.md", makeSkill({ fileBaseName: "z", name: "Z", primary: true }));
		registry.set("b.md", makeSkill({ fileBaseName: "b", name: "B", primary: true }));

		const primary = registry.getPrimary().map((skill) => skill.fileBaseName);
		expect(primary).toEqual(["a", "c", "b", "z"]);
	});

	it("excludes non-primary skills from getPrimary", () => {
		const registry = new SkillRegistry();
		registry.set("a.md", makeSkill({ fileBaseName: "a", primary: true }));
		registry.set("b.md", makeSkill({ fileBaseName: "b", primary: false }));

		expect(registry.getPrimary()).toHaveLength(1);
		expect(registry.getAll()).toHaveLength(2);
	});

	it("removes entries", () => {
		const registry = new SkillRegistry();
		registry.set("a.md", makeSkill({ fileBaseName: "a" }));
		registry.remove("a.md");
		expect(registry.getAll()).toHaveLength(0);
	});

	it("looks up skills by name", () => {
		const registry = new SkillRegistry();
		registry.set("a.md", makeSkill({ fileBaseName: "a", name: "Alpha" }));
		expect(registry.getByName("Alpha")?.fileBaseName).toBe("a");
		expect(registry.getByName("Missing")).toBeUndefined();
	});
});
