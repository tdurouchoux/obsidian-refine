import type { RefineSettings, Skill } from "../types";

export interface ResolvedModelParams {
	model: string;
	temperature: number;
}

export function resolveModelParams(skill: Skill, settings: RefineSettings): ResolvedModelParams {
	return {
		model: skill.model ?? settings.defaultModel,
		temperature: skill.temperature ?? settings.defaultTemperature,
	};
}
