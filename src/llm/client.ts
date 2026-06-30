import { requestUrl } from "obsidian";
import type { RefineSettings, Skill } from "../types";
import { buildMessages } from "./promptBuilder";
import { resolveModelParams } from "./resolveModelParams";
import { RefineApiError, type ChatCompletionRequest, type ChatCompletionResponse } from "./types";

export async function callChatCompletion(
	settings: RefineSettings,
	skill: Skill,
	selectedText: string,
): Promise<string> {
	const { model, temperature } = resolveModelParams(skill, settings);
	const body: ChatCompletionRequest = {
		model,
		temperature,
		messages: buildMessages(skill, selectedText),
	};

	const baseUrl = settings.apiBaseUrl.replace(/\/+$/, "");

	let response;
	try {
		response = await requestUrl({
			url: `${baseUrl}/chat/completions`,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.apiKey}`,
			},
			body: JSON.stringify(body),
			throw: false,
		});
	} catch (error) {
		throw new RefineApiError(`Request failed: ${(error as Error).message}`);
	}

	if (response.status < 200 || response.status >= 300) {
		throw new RefineApiError(`API request failed with status ${response.status}: ${response.text}`);
	}

	let json: ChatCompletionResponse;
	try {
		json = response.json as ChatCompletionResponse;
	} catch {
		throw new RefineApiError("Could not parse API response as JSON.");
	}

	const content = json?.choices?.[0]?.message?.content;
	if (typeof content !== "string") {
		throw new RefineApiError("API response did not contain a message.");
	}

	return content;
}
