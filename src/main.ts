import { MarkdownView, Plugin, WorkspaceLeaf, type Editor } from "obsidian";
import { EditorView } from "@codemirror/view";
import { DEFAULT_SETTINGS, RefineSettingTab } from "./settings";
import type { RefineSettings } from "./types";
import { SkillRegistry } from "./skills/registry";
import { loadAllSkills, registerSkillWatcher } from "./skills/watcher";
import { ensureDefaultSkills } from "./skills/defaultSkills";
import { createUntitledSkill } from "./skills/newSkill";
import { RefineView, VIEW_TYPE_REFINE } from "./ui/RefineView";

export default class RefinePlugin extends Plugin {
	settings!: RefineSettings;
	skillRegistry = new SkillRegistry();
	private lastActiveEditor: Editor | null = null;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_REFINE, (leaf: WorkspaceLeaf) => new RefineView(leaf, this));

		this.addRibbonIcon("wand-2", "Open Refine panel", () => {
			void this.togglePanel();
		});

		this.addCommand({
			id: "open-panel",
			name: "Open panel",
			callback: () => void this.togglePanel(),
		});

		this.addCommand({
			id: "transform-selection",
			name: "Transform selection",
			callback: () => void this.transformSelection(),
		});

		this.addCommand({
			id: "new-skill",
			name: "New skill",
			callback: () => void createUntitledSkill(this, this.settings.skillsFolder),
		});

		this.addSettingTab(new RefineSettingTab(this));

		this.registerEditorExtension(
			EditorView.updateListener.of((update) => {
				if (update.selectionSet || update.docChanged) this.refreshRefineViews();
			}),
		);
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.updateLastActiveEditor();
				this.refreshRefineViews();
			}),
		);
		this.updateLastActiveEditor();

		await ensureDefaultSkills(this, this.settings.skillsFolder);
		await loadAllSkills(this, this.skillRegistry, this.settings.skillsFolder);
		registerSkillWatcher(this, this.skillRegistry, () => this.settings.skillsFolder);
	}

	onunload(): void {
		// Views are detached automatically by Obsidian; nothing else to clean up.
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async reloadSkillsFolder(): Promise<void> {
		await ensureDefaultSkills(this, this.settings.skillsFolder);
		await loadAllSkills(this, this.skillRegistry, this.settings.skillsFolder);
	}

	getActiveEditor(): Editor | null {
		return this.lastActiveEditor;
	}

	private updateLastActiveEditor(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view) this.lastActiveEditor = view.editor;
	}

	refreshRefineViews(): void {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_REFINE)) {
			if (leaf.view instanceof RefineView) leaf.view.render();
		}
	}

	private async togglePanel(): Promise<void> {
		const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_REFINE);
		if (existing.length > 0) {
			existing.forEach((leaf) => leaf.detach());
			return;
		}

		const leaf = this.app.workspace.getRightLeaf(false);
		if (!leaf) return;
		await leaf.setViewState({ type: VIEW_TYPE_REFINE, active: true });
		this.app.workspace.revealLeaf(leaf);
	}

	private async transformSelection(): Promise<void> {
		const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_REFINE);
		let leaf: WorkspaceLeaf;
		if (existing.length > 0) {
			leaf = existing[0];
		} else {
			const newLeaf = this.app.workspace.getRightLeaf(false);
			if (!newLeaf) return;
			leaf = newLeaf;
			await leaf.setViewState({ type: VIEW_TYPE_REFINE, active: true });
		}
		this.app.workspace.revealLeaf(leaf);

		const view = leaf.view;
		if (view instanceof RefineView) {
			view.runLastUsedSkill();
		}
	}
}
