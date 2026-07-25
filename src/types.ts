export interface Skill {
	filePath: string;
	fileBaseName: string;
	name: string;
	description: string;
	icon?: string;
	primary: boolean;
	order?: number;
	model?: string;
	temperature?: number;
	systemPrompt: string;
}

export interface RefineSettings {
	apiBaseUrl: string;
	apiKeySecretName: string;
	defaultModel: string;
	defaultTemperature: number;
	skillsFolder: string;
	lastUsedSkillPath?: string;
}
