import { describe, expect, it } from "vitest";
import { buildSkillTemplate } from "./skillTemplate";

describe("buildSkillTemplate", () => {
	const template = buildSkillTemplate();

	it("includes all frontmatter keys", () => {
		for (const key of ["name", "description", "icon", "primary", "order", "model", "temperature"]) {
			expect(template).toContain(`${key}:`);
		}
	});

	it("includes placeholder sections", () => {
		for (const section of ["## Description", "## When to use", "## Instructions", "## Examples"]) {
			expect(template).toContain(section);
		}
	});

	it("starts with a frontmatter block", () => {
		expect(template.startsWith("---\n")).toBe(true);
	});
});
