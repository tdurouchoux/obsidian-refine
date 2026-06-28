import type { Vault } from "obsidian";

export async function ensureFolder(vault: Vault, path: string): Promise<void> {
	if (vault.getAbstractFileByPath(path)) return;
	try {
		await vault.createFolder(path);
	} catch (error) {
		if (!(error as Error).message?.includes("already exists")) throw error;
	}
}
