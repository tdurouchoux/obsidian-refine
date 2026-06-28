import { PluginSettingTab, Setting } from "obsidian";
import type RefinePlugin from "./main";
import type { RefineSettings } from "./types";

export const DEFAULT_SETTINGS: RefineSettings = {
	apiBaseUrl: "https://api.openai.com/v1",
	apiKey: "",
	defaultModel: "gpt-4o",
	defaultTemperature: 0.7,
	skillsFolder: "Refine/Skills",
};

export class RefineSettingTab extends PluginSettingTab {
	plugin: RefinePlugin;

	constructor(plugin: RefinePlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl)
			.setName("API base URL")
			.setDesc("The base URL of any OpenAI-compatible endpoint.")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.apiBaseUrl)
					.setValue(this.plugin.settings.apiBaseUrl)
					.onChange(async (value) => {
						this.plugin.settings.apiBaseUrl = value.trim() || DEFAULT_SETTINGS.apiBaseUrl;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(this.containerEl)
			.setName("API key")
			.setDesc("The key used to authenticate with the provider.")
			.addText((text) => {
				text.inputEl.type = "password";
				text.setValue(this.plugin.settings.apiKey).onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(this.containerEl)
			.setName("Default model")
			.setDesc("Used when a skill does not specify its own model.")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.defaultModel)
					.setValue(this.plugin.settings.defaultModel)
					.onChange(async (value) => {
						this.plugin.settings.defaultModel = value.trim() || DEFAULT_SETTINGS.defaultModel;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(this.containerEl)
			.setName("Default temperature")
			.setDesc("Used when a skill does not specify its own temperature.")
			.addText((text) =>
				text
					.setPlaceholder(String(DEFAULT_SETTINGS.defaultTemperature))
					.setValue(String(this.plugin.settings.defaultTemperature))
					.onChange(async (value) => {
						const parsed = Number.parseFloat(value);
						this.plugin.settings.defaultTemperature = Number.isFinite(parsed)
							? parsed
							: DEFAULT_SETTINGS.defaultTemperature;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(this.containerEl)
			.setName("Skills folder")
			.setDesc("Vault-relative path to the folder where skills are stored.")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.skillsFolder)
					.setValue(this.plugin.settings.skillsFolder)
					.onChange(async (value) => {
						const newFolder = value.trim() || DEFAULT_SETTINGS.skillsFolder;
						this.plugin.settings.skillsFolder = newFolder;
						await this.plugin.saveSettings();
						await this.plugin.reloadSkillsFolder();
					}),
			);
	}
}
