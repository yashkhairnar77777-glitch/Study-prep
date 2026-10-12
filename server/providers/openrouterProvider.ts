import { ChatMessage, ProviderResponse } from './types.js';

export class OpenRouterProvider {
  private getApiKey(): string | undefined {
    let key = (process.env.OPENROUTER_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    if (!key) return undefined;
    if (key.startsWith('Bearer ')) {
      key = key.slice(7).trim();
    }
    if (
      !key ||
      key === 'undefined' ||
      key === 'null' ||
      key === 'MY_OPENROUTER_API_KEY' ||
      key.includes('placeholder') ||
      !key.startsWith('sk-or-') ||
      key.length < 20
    ) {
      return undefined;
    }
    return key;
  }

  private getModel(): string {
    const model = (process.env.OPENROUTER_MODEL || '').trim().replace(/^["']|["']$/g, '');
    if (!model || model.startsWith('sk-') || model.length > 60) {
      return 'meta-llama/llama-3.3-70b-instruct:free';
    }
    return model;
  }

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.startsWith('sk-or-') && key.length > 20);
  }

  public getConfig() {
    return {
      configured: this.isConfigured(),
      model: this.getModel(),
      hasVision: true,
    };
  }

  public async generateChat(
    messages: ChatMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<ProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured with a valid sk-or- key.');
    }

    const model = this.getModel();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://oryqenstudy.ai',
          'X-Title': 'ORYQEN STUDY AI',
        },
        body: JSON.stringify({
          model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature: options?.temperature ?? 0.4,
          max_tokens: options?.maxTokens ?? 3500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        let message = `OpenRouter error (status ${response.status})`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error?.message) {
            message += `: ${parsed.error.message}`;
          }
        } catch {
          message += `: ${errText.slice(0, 200)}`;
        }
        throw new Error(message);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return {
        content,
        providerUsed: 'openrouter',
        modelUsed: model,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('OpenRouter request timed out after 45 seconds.');
        }
        throw err;
      }
      throw new Error('Unknown OpenRouter execution failure');
    }
  }

  public async generateVision(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<ProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured with a valid sk-or- key.');
    }

    const model = this.getModel();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://oryqenstudy.ai',
          'X-Title': 'ORYQEN STUDY AI',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.2,
          max_tokens: 3500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter Vision error (status ${response.status}): ${errText.slice(0, 250)}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return {
        content,
        providerUsed: 'openrouter',
        modelUsed: model,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('OpenRouter Vision request timed out after 60 seconds.');
      }
      throw err;
    }
  }
}
