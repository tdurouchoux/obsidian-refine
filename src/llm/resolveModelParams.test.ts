import { describe, expect, it } from "vitest";
import { resolveModelParams } from "./resolveModelParams";
import type { RefineSettings, Skill } from "../types";

const settings: RefineSettings = {
	apiBaseUrl: "https://api.openai.com/v1",
	apiKeySecretName: "",
	defaultModel: "gpt-4o",
	defaultTemperature: 0.7,
	skillsFolder: "Refine/Skills",
};

function makeSkill(overrides: Partial<Skill> = {}): Skill {
	return {
		filePath: "skill.md",
		fileBaseName: "skill",
		name: "Skill",
		description: "A skill.",
		primary: false,
		systemPrompt: "Do something.",
		...overrides,
	};
}

describe("resolveModelParams", () => {
	it("uses the skill's overrides when present", () => {
		const skill = makeSkill({ model: "gpt-4o-mini", temperature: 0.1 });
		expect(resolveModelParams(skill, settings)).toEqual({ model: "gpt-4o-mini", temperature: 0.1 });
	});

	it("falls back to settings defaults when absent", () => {
		const skill = makeSkill();
		expect(resolveModelParams(skill, settings)).toEqual({ model: "gpt-4o", temperature: 0.7 });
	});

	it("allows mixing an overridden model with a default temperature", () => {
		const skill = makeSkill({ model: "custom-model" });
		expect(resolveModelParams(skill, settings)).toEqual({ model: "custom-model", temperature: 0.7 });
	});
});
