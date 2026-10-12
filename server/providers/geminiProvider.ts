import { GoogleGenAI } from '@google/genai';
import { ChatMessage, ProviderResponse } from './types.js';

export class GeminiProvider {
  private getApiKey(): string | undefined {
    const raw = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    if (!raw || raw === 'undefined' || raw === 'null' || raw.includes('MY_GEMINI_API_KEY')) {
      return undefined;
    }
    return raw;
  }

  private getModel(): string {
    const raw = (process.env.GEMINI_MODEL || '').trim().replace(/^["']|["']$/g, '');
    const clean = raw.replace(/^models\//, '');
    // Strictly prevent obsolete / deprecated models from failing API requests
    if (
      !clean ||
      clean.startsWith('gemini-1.') ||
      clean.startsWith('gemini-2.') ||
      clean.includes('2.5') ||
      clean.includes('2.0') ||
      clean.includes('1.5') ||
      clean.includes('1.0') ||
      clean.includes('pro-vision')
    ) {
      return 'gemini-3.8-flash';
    }
    return clean;
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

    const model = this.getModel();
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

    try {
      const response = await ai.models.generateContent({
        model,
        contents: normalizedContents,
        config: {
          systemInstruction,
          temperature: options?.temperature ?? 0.4,
          maxOutputTokens: options?.maxTokens ?? 3500,
        },
      });

      const text =
        response.text ||
        response.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') ||
        '';

      return {
        content: text,
        providerUsed: 'gemini',
        modelUsed: model,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        let msg = err.message;
        try {
          const parsed = JSON.parse(msg);
          if (parsed.error?.message) {
            msg = parsed.error.message;
          }
        } catch {}
        if (msg.includes('503') || msg.toLowerCase().includes('high demand')) {
          msg = 'Gemini model is currently experiencing temporary high demand (503).';
        }
        throw new Error(`Gemini provider error: ${msg}`);
      }
      throw new Error('Unknown Gemini execution failure');
    }
  }

  public async generateVision(
    prompt: string,
    imageBase64: string,
    mimeType: string
  ): Promise<ProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }

    const model = this.getModel();
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    try {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      const response = await ai.models.generateContent({
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

      const text =
        response.text ||
        response.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') ||
        '';

      return {
        content: text,
        providerUsed: 'gemini',
        modelUsed: model,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Gemini Vision error: ${err.message}`);
      }
      throw new Error('Unknown Gemini vision failure');
    }
  }
}
