import { TAbstractFile, TFile, type Plugin } from "obsidian";
import { parseSkillFile } from "./parser";
import { SkillRegistry } from "./registry";

function isWithinFolder(filePath: string, folder: string): boolean {
	const normalizedFolder = folder.replace(/\/+$/, "");
	return filePath === normalizedFolder || filePath.startsWith(normalizedFolder + "/");
}

async function syncFile(plugin: Plugin, registry: SkillRegistry, file: TAbstractFile): Promise<void> {
	if (!(file instanceof TFile) || file.extension !== "md") return;
	const raw = await plugin.app.vault.read(file);
	const skill = parseSkillFile(raw, file.path);
	if (skill) {
		registry.set(file.path, skill);
	} else {
		registry.remove(file.path);
	}
}

export async function loadAllSkills(plugin: Plugin, registry: SkillRegistry, skillsFolder: string): Promise<void> {
	registry.clear();
	const files = plugin.app.vault.getMarkdownFiles().filter((file) => isWithinFolder(file.path, skillsFolder));
	for (const file of files) {
		await syncFile(plugin, registry, file);
	}
}

export function registerSkillWatcher(plugin: Plugin, registry: SkillRegistry, getSkillsFolder: () => string): void {
	plugin.registerEvent(
		plugin.app.vault.on("create", (file) => {
			if (isWithinFolder(file.path, getSkillsFolder())) void syncFile(plugin, registry, file);
		}),
	);

	plugin.registerEvent(
		plugin.app.vault.on("modify", (file) => {
			if (isWithinFolder(file.path, getSkillsFolder())) void syncFile(plugin, registry, file);
		}),
	);

	plugin.registerEvent(
		plugin.app.vault.on("delete", (file) => {
			if (isWithinFolder(file.path, getSkillsFolder())) registry.remove(file.path);
		}),
	);

	plugin.registerEvent(
		plugin.app.vault.on("rename", (file, oldPath) => {
			const folder = getSkillsFolder();
			if (isWithinFolder(oldPath, folder)) registry.remove(oldPath);
			if (isWithinFolder(file.path, folder)) void syncFile(plugin, registry, file);
		}),
	);
}
