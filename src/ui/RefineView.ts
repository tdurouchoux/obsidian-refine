import { ItemView, Notice, type Editor, type EditorRange, type WorkspaceLeaf } from "obsidian";
import type RefinePlugin from "../main";
import type { Skill } from "../types";
import { callChatCompletion } from "../llm/client";
import { computeWordDiff } from "../diff/wordDiff";
import { renderWordDiff } from "../diff/renderDiff";
import { SkillSuggest } from "./SkillSuggest";

export const VIEW_TYPE_REFINE = "refine-view";

interface RequestContext {
	editor: Editor;
	range: EditorRange;
	originalText: string;
	skill: Skill;
}

type PanelState =
	| { kind: "idle" }
	| { kind: "loading"; context: RequestContext }
	| { kind: "result"; context: RequestContext; transformedText: string }
	| { kind: "error"; context: RequestContext; message: string };

export class RefineView extends ItemView {
	plugin: RefinePlugin;
	private state: PanelState = { kind: "idle" };

	private primaryButtonsEl!: HTMLElement;
	private searchInputEl!: HTMLInputElement;
	private bodyEl!: HTMLElement;

	constructor(leaf: WorkspaceLeaf, plugin: RefinePlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return VIEW_TYPE_REFINE;
	}

	getDisplayText(): string {
		return "Refine";
	}

	getIcon(): string {
		return "wand-2";
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass("refine-view-content");

		this.primaryButtonsEl = container.createDiv({ cls: "refine-primary-buttons" });

		this.searchInputEl = container.createEl("input", {
			type: "text",
			placeholder: "Search skills…",
			cls: "refine-skill-search",
		});
		new SkillSuggest(
			this.app,
			this.searchInputEl,
			() => this.plugin.skillRegistry.getAll(),
			(skill) => {
				this.searchInputEl.value = "";
				void this.runSkill(skill);
			},
		);

		this.bodyEl = container.createDiv({ cls: "refine-body" });

		this.render();
	}

	async onClose(): Promise<void> {
		this.containerEl.empty();
	}

	render(): void {
		this.renderPrimaryButtons();
		this.renderBody();
	}

	private renderPrimaryButtons(): void {
		this.primaryButtonsEl.empty();
		const isBusy = this.state.kind === "loading";
		for (const skill of this.plugin.skillRegistry.getPrimary()) {
			const button = this.primaryButtonsEl.createEl("button", {
				text: skill.icon ? `${skill.icon} ${skill.name}` : skill.name,
			});
			button.disabled = isBusy;
			button.addEventListener("click", () => void this.runSkill(skill));
		}
	}

	private renderBody(): void {
		this.bodyEl.empty();
		const activeEditor = this.plugin.getActiveEditor();
		const hasSelection = !!activeEditor && activeEditor.getSelection().length > 0;

		switch (this.state.kind) {
			case "idle": {
				if (!hasSelection) {
					this.bodyEl.createDiv({ cls: "refine-placeholder", text: "Select some text to refine." });
				}
				break;
			}
			case "loading": {
				const loading = this.bodyEl.createDiv({ cls: "refine-loading" });
				loading.createDiv({ cls: "refine-spinner" });
				loading.createSpan({ text: "Refining…" });
				break;
			}
			case "result": {
				const tokens = computeWordDiff(this.state.context.originalText, this.state.transformedText);
				const resultEl = this.bodyEl.createDiv({ cls: "refine-result" });
				renderWordDiff(resultEl, tokens);

				const actionsEl = this.bodyEl.createDiv({ cls: "refine-actions" });
				const replaceButton = actionsEl.createEl("button", { text: "Replace in note" });
				replaceButton.addEventListener("click", () => this.replaceInNote());
				const copyButton = actionsEl.createEl("button", { text: "Copy" });
				copyButton.addEventListener("click", () => void this.copyResult());
				break;
			}
			case "error": {
				this.bodyEl.createDiv({ cls: "refine-error", text: this.state.message });
				const errorContext = this.state.context;
				const retryButton = this.bodyEl.createEl("button", { text: "Retry" });
				retryButton.addEventListener("click", () => void this.runSkill(errorContext.skill, true));
				break;
			}
		}
	}

	private async runSkill(skill: Skill, isRetry = false): Promise<void> {
		let context: RequestContext;

		if (isRetry && (this.state.kind === "error" || this.state.kind === "result")) {
			context = this.state.context;
		} else {
			const activeEditor = this.plugin.getActiveEditor();
			if (!activeEditor) return;
			const selection = activeEditor.getSelection();
			if (!selection) return;
			context = {
				editor: activeEditor,
				range: { from: activeEditor.getCursor("from"), to: activeEditor.getCursor("to") },
				originalText: selection,
				skill,
			};
		}

		this.state = { kind: "loading", context };
		this.render();

		this.plugin.settings.lastUsedSkillPath = context.skill.filePath;
		await this.plugin.saveSettings();

		try {
			const transformedText = await callChatCompletion(this.plugin.settings, context.skill, context.originalText);
			this.state = { kind: "result", context, transformedText };
		} catch (error) {
			this.state = { kind: "error", context, message: (error as Error).message };
		}
		this.render();
	}

	private replaceInNote(): void {
		if (this.state.kind !== "result") return;
		const { editor, range } = this.state.context;
		editor.replaceRange(this.state.transformedText, range.from, range.to);
	}

	private async copyResult(): Promise<void> {
		if (this.state.kind !== "result") return;
		await navigator.clipboard.writeText(this.state.transformedText);
		new Notice("Copied to clipboard.");
	}

	runLastUsedSkill(): void {
		const lastUsedPath = this.plugin.settings.lastUsedSkillPath;
		if (!lastUsedPath) return;
		const skill = this.plugin.skillRegistry.getByPath(lastUsedPath);
		if (!skill) return;
		const activeEditor = this.plugin.getActiveEditor();
		if (!activeEditor || !activeEditor.getSelection()) return;
		void this.runSkill(skill);
	}
}
