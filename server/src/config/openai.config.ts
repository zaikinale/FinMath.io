import OpenAI from 'openai';

export const getOpenRouterClient = (userApiKey?: string | null): OpenAI => {
  const finalApiKey = userApiKey?.trim() || process.env.OPENROUTER_API_KEY;

  if (!finalApiKey) {
    throw new Error('API ключ OpenRouter не найден ни у пользователя, ни в конфигурации сервера (.env)');
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: finalApiKey,
    defaultHeaders: {
      'HTTP-Referer': process.env.SERVER_URL || 'http://localhost:3000',
      'X-Title': 'FinMath',
    },
  });
};