export type ChatRequest = {
  prompt: string;
};

export type ChatResponse = {
  content: string;
  model: string;
  provider: string;
};

export type ProviderChat = (req: ChatRequest) => Promise<ChatResponse>;

export type ChatProvider = {
  chat: ProviderChat;
};

