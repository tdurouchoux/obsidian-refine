export interface ChatMessage {
	role: "system" | "user";
	content: string;
}

export interface ChatCompletionRequest {
	model: string;
	temperature: number;
	messages: ChatMessage[];
}

export interface ChatCompletionResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
}

export class RefineApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RefineApiError";
	}
}
