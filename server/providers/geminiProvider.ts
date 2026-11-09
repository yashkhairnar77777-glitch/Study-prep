import { GoogleGenAI } from '@google/genai';
import { ChatMessage, ProviderResponse } from './types.js';

export class GeminiProvider {
  private getResolvedCredentials() {
    let rawApiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim().replace(/^["']|["']$/g, '');
    let rawModel = (process.env.GEMINI_MODEL || '').trim().replace(/^["']|["']$/g, '');

    // If GEMINI_MODEL was accidentally populated with an API key (starts with 'AIza' or long token)
    if (rawModel.startsWith('AIza') || (rawModel.length > 30 && !rawModel.includes('-') && !rawModel.includes('/'))) {
      if (!rawApiKey.startsWith('AIza')) {
        rawApiKey = rawModel;
      }
      rawModel = '';
    }

    // If GEMINI_API_KEY was accidentally set to a model name
    if (rawApiKey.startsWith('gemini-') || rawApiKey.startsWith('models/')) {
      if (!rawModel) {
        rawModel = rawApiKey;
      }
      rawApiKey = '';
    }

    const cleanModel = rawModel.replace(/^models\//, '');
    let finalModel = 'gemini-3.8-flash';
    if (
      cleanModel &&
      !cleanModel.startsWith('AIza') &&
      !cleanModel.startsWith('gemini-1.') &&
      !cleanModel.startsWith('gemini-2.') &&
      !cleanModel.includes('2.5') &&
      !cleanModel.includes('2.0') &&
      !cleanModel.includes('1.5') &&
      !cleanModel.includes('1.0') &&
      cleanModel.length < 40
    ) {
      finalModel = cleanModel;
    }

    const apiKey =
      rawApiKey && rawApiKey !== 'undefined' && rawApiKey !== 'null' && !rawApiKey.includes('MY_GEMINI_API_KEY')
        ? rawApiKey
        : undefined;

    return {
      apiKey,
      model: finalModel,
    };
  }

  private getApiKey(): string | undefined {
    return this.getResolvedCredentials().apiKey;
  }

  private getModel(): string {
    return this.getResolvedCredentials().model;
  }

  private getCandidateModels(): string[] {
    const { model } = this.getResolvedCredentials();
    const defaults = [
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
    ];
    if (model && !defaults.includes(model)) {
      return [model, ...defaults];
    }
    return defaults;
  }

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
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
      throw new Error('GEMINI_API_KEY is not configured in the environment.');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let systemInstruction: string | undefined = undefined;
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        if (!systemInstruction) {
          systemInstruction = msg.content;
        } else {
          systemInstruction += `\n\n${msg.content}`;
        }
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: systemInstruction || 'Hello' }],
      });
      systemInstruction = undefined;
    }

    // Merge consecutive messages of same role to guarantee valid alternating turns
    const normalizedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const item of contents) {
      const prev = normalizedContents[normalizedContents.length - 1];
      if (prev && prev.role === item.role) {
        prev.parts[0].text += `\n\n${item.parts[0].text}`;
      } else {
        normalizedContents.push({ role: item.role, parts: [{ text: item.parts[0].text }] });
      }
    }

    if (normalizedContents.length > 0 && normalizedContents[0].role === 'model') {
      normalizedContents.unshift({ role: 'user', parts: [{ text: 'Begin tutoring session.' }] });
    }

    const candidateModels = this.getCandidateModels();
    let lastError: Error | null = null;

    for (const model of candidateModels) {
      let timeoutId: NodeJS.Timeout | undefined;
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Timeout: Gemini request exceeded 45s on model ${model}`));
          }, 45000);
        });

        const apiPromise = ai.models.generateContent({
          model,
          contents: normalizedContents,
          config: {
            systemInstruction,
            temperature: options?.temperature ?? 0.4,
            maxOutputTokens: options?.maxTokens ?? 3500,
          },
        });

        const response = await Promise.race([apiPromise, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);

        const text =
          response.text ||
          response.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') ||
          '';

        if (text) {
          return {
            content: text,
            providerUsed: 'gemini',
            modelUsed: model,
          };
        }
      } catch (err: unknown) {
        if (timeoutId) clearTimeout(timeoutId);
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[GeminiProvider] Model ${model} failed (${lastError.message}). Attempting next candidate...`);
      }
    }

    let msg = lastError?.message || 'Unknown Gemini execution failure';
    try {
      const parsed = JSON.parse(msg);
      if (parsed.error?.message) {
        msg = parsed.error.message;
      }
    } catch {}
    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('resource_exhausted')) {
      msg = 'Gemini rate limit or quota exceeded (429).';
    } else if (msg.includes('503') || msg.toLowerCase().includes('high demand')) {
      msg = 'Gemini model is currently experiencing temporary high demand (503).';
    }
    throw new Error(`Gemini provider error: ${msg}`);
  }

  public async generateVision(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<ProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment.');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
    const candidateModels = this.getCandidateModels();
    let lastError: Error | null = null;

    for (const model of candidateModels) {
      let timeoutId: NodeJS.Timeout | undefined;
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Timeout: Gemini vision request exceeded 45s on model ${model}`));
          }, 45000);
        });

        const apiPromise = ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: mimeType || 'image/jpeg',
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
            temperature: 0.2,
            maxOutputTokens: 3500,
          },
        });

        const response = await Promise.race([apiPromise, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);

        const text =
          response.text ||
          response.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') ||
          '';

        if (text) {
          return {
            content: text,
            providerUsed: 'gemini',
            modelUsed: model,
          };
        }
      } catch (err: unknown) {
        if (timeoutId) clearTimeout(timeoutId);
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[GeminiProvider Vision] Model ${model} failed (${lastError.message}). Attempting next candidate...`);
      }
    }

    let msg = lastError?.message || 'Failed to analyze image';
    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('resource_exhausted')) {
      msg = 'Gemini rate limit or quota exceeded (429).';
    }
    throw new Error(`Gemini Vision error: ${msg}`);
  }
}
