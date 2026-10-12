import { ChatMessage, ProviderResponse } from './types.js';

export class GroqProvider {
  private cachedModels: string[] | null = null;
  private lastModelFetchTime = 0;

  private getResolvedCredentials() {
    let rawApiKey = (process.env.GROQ_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    let rawModel = (process.env.GROQ_MODEL || '').trim().replace(/^["']|["']$/g, '');

    // If GROQ_MODEL was accidentally set to an API key (starts with 'gsk_' or long token)
    if (rawModel.startsWith('gsk_') || (rawModel.length > 35 && !rawModel.includes('-') && !rawModel.includes('/'))) {
      if (!rawApiKey.startsWith('gsk_')) {
        rawApiKey = rawModel;
      }
      rawModel = '';
    }

    // If GROQ_API_KEY was accidentally set to a model name
    if (
      rawApiKey.startsWith('llama-') ||
      rawApiKey.startsWith('mixtral-') ||
      rawApiKey.startsWith('gemma') ||
      rawApiKey.startsWith('qwen/') ||
      rawApiKey.startsWith('openai/')
    ) {
      if (!rawModel) {
        rawModel = rawApiKey;
      }
      rawApiKey = '';
    }

    // Curated list of verified active Groq production models
    const candidateModels: string[] = [];
    if (
      rawModel &&
      !rawModel.startsWith('gsk_') &&
      !rawModel.startsWith('sk-') &&
      rawModel.length < 50
    ) {
      candidateModels.push(rawModel);
    }

    // If we have cached models from Groq API for this account, prioritize them
    if (this.cachedModels && this.cachedModels.length > 0) {
      this.cachedModels.forEach(m => {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      });
    }

    // Verified production models on Groq platform
    const defaultCandidates = [
      'openai/gpt-oss-120b',
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-20b',
      'allam-2-7b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
    ];

    defaultCandidates.forEach(m => {
      if (!candidateModels.includes(m)) candidateModels.push(m);
    });

    const visionCandidates: string[] = [];
    let envVision = (process.env.GROQ_VISION_MODEL || '').trim().replace(/^["']|["']$/g, '');
    if (envVision.startsWith('gsk_')) {
      envVision = '';
    }

    if (envVision && envVision.length < 50) {
      visionCandidates.push(envVision);
    }
    ['qwen/qwen3.8-27b', 'llama-3.2-11b-vision-preview', 'llama-3.2-90b-vision-preview'].forEach(m => {
      if (!visionCandidates.includes(m)) visionCandidates.push(m);
    });

    return {
      apiKey: rawApiKey || undefined,
      candidateModels,
      visionCandidates,
    };
  }

  public async refreshAvailableModels(apiKey: string): Promise<string[]> {
    const now = Date.now();
    // Cache for 10 minutes
    if (this.cachedModels && now - this.lastModelFetchTime < 600000) {
      return this.cachedModels;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          const availableTextModels = data.data
            .map((m: { id: string }) => m.id)
            .filter((id: string) => {
              const lower = id.toLowerCase();
              return (
                !lower.includes('whisper') &&
                !lower.includes('guard') &&
                !lower.includes('orpheus') &&
                !lower.includes('safeguard') &&
                !lower.includes('allam')
              );
            });

          // Sort by reasoning capability: 120b -> qwen 27b -> 20b -> others
          availableTextModels.sort((a: string, b: string) => {
            const score = (name: string) => {
              if (name.includes('120b')) return 100;
              if (name.includes('qwen3.8-27b')) return 90;
              if (name.includes('llama-3.3-70b')) return 80;
              if (name.includes('20b')) return 70;
              if (name.includes('llama-3.1-8b')) return 60;
              return 10;
            };
            return score(b) - score(a);
          });

          if (availableTextModels.length > 0) {
            this.cachedModels = availableTextModels;
            this.lastModelFetchTime = now;
            return availableTextModels;
          }
        }
      }
    } catch {
      // Gracefully fall back to pre-configured candidate list
    }

    return [];
  }

  public isConfigured(): boolean {
    const { apiKey } = this.getResolvedCredentials();
    return Boolean(
      apiKey &&
      apiKey.length > 15 &&
      !apiKey.includes('MY_GROQ_API_KEY') &&
      apiKey.startsWith('gsk_')
    );
  }

  public getConfig() {
    const { candidateModels, visionCandidates } = this.getResolvedCredentials();
    return {
      configured: this.isConfigured(),
      model: candidateModels[0] || 'openai/gpt-oss-120b',
      visionModel: visionCandidates[0] || 'qwen/qwen3.8-27b',
      hasVision: true,
    };
  }

  public async generateChat(
    messages: ChatMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<ProviderResponse> {
    const { apiKey, candidateModels: initialCandidates } = this.getResolvedCredentials();
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured in the environment.');
    }

    // Attempt to discover active models for this account
    await this.refreshAvailableModels(apiKey);
    const { candidateModels } = this.getResolvedCredentials();
    const modelsToTry = candidateModels.length > 0 ? candidateModels : initialCandidates;

    let lastError: Error | null = null;

    // Try candidate models in order (if one is deprecated, 404, or 400 decommissioned)
    for (const model of modelsToTry) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
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
          let parsedMsg = errText.slice(0, 200);
          try {
            const parsed = JSON.parse(errText);
            if (parsed.error?.message) parsedMsg = parsed.error.message;
          } catch {}

          const isModelError =
            response.status === 404 ||
            parsedMsg.toLowerCase().includes('model') ||
            parsedMsg.toLowerCase().includes('decommissioned') ||
            parsedMsg.toLowerCase().includes('does not exist');

          // If model error, try next candidate model
          if (isModelError && modelsToTry.indexOf(model) < modelsToTry.length - 1) {
            console.warn(`[Groq] Model ${model} error (${parsedMsg}), trying next model...`);
            lastError = new Error(`Groq error (${model}): ${parsedMsg}`);
            continue;
          }

          throw new Error(`Groq error (status ${response.status}): ${parsedMsg}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        return {
          content,
          providerUsed: 'groq',
          modelUsed: model,
        };
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof Error) {
          lastError = err;
          // If it was an abort/timeout or model error and we have more models
          if (
            (err.name === 'AbortError' || err.message.toLowerCase().includes('model')) &&
            modelsToTry.indexOf(model) < modelsToTry.length - 1
          ) {
            console.warn(`[Groq] Failed with ${model}, trying next...`);
            continue;
          }
          throw err;
        }
        throw new Error('Unknown Groq network failure');
      }
    }

    throw lastError || new Error('All Groq candidate models failed to respond.');
  }

  public async generateVision(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<ProviderResponse> {
    const { apiKey, visionCandidates } = this.getResolvedCredentials();
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured in the environment.');
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${cleanBase64}`;

    let lastError: Error | null = null;

    for (const model of visionCandidates) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
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
                      url: dataUrl,
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
          let parsedMsg = errText.slice(0, 200);
          try {
            const parsed = JSON.parse(errText);
            if (parsed.error?.message) parsedMsg = parsed.error.message;
          } catch {}

          if (
            (response.status === 404 || parsedMsg.toLowerCase().includes('model')) &&
            visionCandidates.indexOf(model) < visionCandidates.length - 1
          ) {
            continue;
          }

          throw new Error(`Groq Vision error (status ${response.status}): ${parsedMsg}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        return {
          content,
          providerUsed: 'groq',
          modelUsed: model,
        };
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof Error) {
          lastError = err;
          if (visionCandidates.indexOf(model) < visionCandidates.length - 1) {
            continue;
          }
          throw err;
        }
        throw new Error('Groq Vision processing failed');
      }
    }

    throw lastError || new Error('No Groq vision models available.');
  }
}
