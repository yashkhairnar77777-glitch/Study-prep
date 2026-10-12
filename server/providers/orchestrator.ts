import { GroqProvider } from './groqProvider.js';
import { OpenRouterProvider } from './openrouterProvider.js';
import { GeminiProvider } from './geminiProvider.js';
import { ChatMessage, ProviderResponse, ProviderStatusInfo } from './types.js';

export class ProviderOrchestrator {
  private groq: GroqProvider;
  private openrouter: OpenRouterProvider;
  private gemini: GeminiProvider;

  constructor() {
    this.groq = new GroqProvider();
    this.openrouter = new OpenRouterProvider();
    this.gemini = new GeminiProvider();
  }

  public getStatus(): ProviderStatusInfo {
    const groqCfg = this.groq.getConfig();
    const openrouterCfg = this.openrouter.getConfig();
    const geminiCfg = this.gemini.getConfig();

    let primary: ProviderStatusInfo['primary'] = 'none';
    let secondary: ProviderStatusInfo['secondary'] = 'none';

    if (groqCfg.configured) {
      primary = 'groq';
      if (openrouterCfg.configured) secondary = 'openrouter';
      else if (geminiCfg.configured) secondary = 'gemini';
    } else if (openrouterCfg.configured) {
      primary = 'openrouter';
      if (geminiCfg.configured) secondary = 'gemini';
    } else if (geminiCfg.configured) {
      primary = 'gemini';
    }

    return {
      groq: groqCfg,
      openrouter: openrouterCfg,
      gemini: geminiCfg,
      primary,
      secondary,
    };
  }

  public async executeChat(
    messages: ChatMessage[],
    options?: {
      preferredProvider?: 'auto' | 'groq' | 'openrouter' | 'gemini';
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<ProviderResponse> {
    const preferred = options?.preferredProvider || 'auto';
    const errors: string[] = [];

    // If a specific provider was explicitly requested and is configured:
    if (preferred !== 'auto') {
      if (preferred === 'groq' && this.groq.isConfigured()) {
        try {
          return await this.groq.generateChat(messages, options);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Groq (explicit): ${msg}`);
        }
      } else if (preferred === 'openrouter' && this.openrouter.isConfigured()) {
        try {
          return await this.openrouter.generateChat(messages, options);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`OpenRouter (explicit): ${msg}`);
        }
      } else if (preferred === 'gemini' && this.gemini.isConfigured()) {
        try {
          return await this.gemini.generateChat(messages, options);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Gemini (explicit): ${msg}`);
        }
      }
    }

    // Standard Fallback Flow: Groq (Primary) -> OpenRouter (Secondary) -> Gemini (AI Studio Fallback)
    // 1. Primary: Groq
    if (this.groq.isConfigured()) {
      try {
        const result = await this.groq.generateChat(messages, options);
        return result;
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Groq (Primary) failed: ${errMessage}`);
        // Log cleanly on server
        console.warn(`[Provider Orchestrator] Groq error, attempting secondary fallback: ${errMessage}`);
      }
    } else {
      errors.push('Groq (Primary) is not configured in environment (GROQ_API_KEY missing).');
    }

    // 2. Secondary: OpenRouter
    if (this.openrouter.isConfigured()) {
      try {
        const result = await this.openrouter.generateChat(messages, options);
        return {
          ...result,
          fallbackOccurred: true,
          fallbackDetails: `Response served by secondary provider OpenRouter (${result.modelUsed}) after Groq encountered an issue.`,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`OpenRouter (Secondary) failed: ${errMessage}`);
        console.warn(`[Provider Orchestrator] OpenRouter error, attempting Gemini: ${errMessage}`);
      }
    } else {
      errors.push('OpenRouter is not configured in environment (OPENROUTER_API_KEY missing).');
    }

    // 3. Fallback: Google Gemini
    if (this.gemini.isConfigured()) {
      try {
        const result = await this.gemini.generateChat(messages, options);
        return {
          ...result,
          fallbackOccurred: true,
          fallbackDetails: `Response served by Gemini (${result.modelUsed}) as reliable AI fallback.`,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Gemini failed: ${errMessage}`);
        console.warn(`[Provider Orchestrator] Gemini error: ${errMessage}`);
      }
    } else {
      errors.push('Gemini is not configured in environment (GEMINI_API_KEY missing).');
    }

    // If all failed, provide transparent, informative error
    const failureSummary = errors.join(' \n• ');
    throw new Error(
      `All configured AI providers failed to complete the request.\n• ${failureSummary}\n\nPlease check your API keys or rate limits in your environment settings and try again.`
    );
  }

  public async executeVision(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    preferredProvider?: 'auto' | 'groq' | 'openrouter' | 'gemini'
  ): Promise<ProviderResponse> {
    const preferred = preferredProvider || 'auto';
    const errors: string[] = [];

    // Check providers that have vision capabilities
    // Primary: Groq Vision if configured
    if ((preferred === 'auto' || preferred === 'groq') && this.groq.isConfigured()) {
      try {
        return await this.groq.generateVision(prompt, imageBase64, mimeType);
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Groq Vision failed: ${errMessage}`);
      }
    }

    // Secondary: OpenRouter if configured
    if ((preferred === 'auto' || preferred === 'openrouter') && this.openrouter.isConfigured()) {
      try {
        const res = await this.openrouter.generateVision(prompt, imageBase64, mimeType);
        return {
          ...res,
          fallbackOccurred: true,
          fallbackDetails: `Image analyzed using OpenRouter vision model (${res.modelUsed}).`,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`OpenRouter Vision failed: ${errMessage}`);
      }
    }

    // Fallback: Gemini Vision (native multimodal)
    if (this.gemini.isConfigured()) {
      try {
        const res = await this.gemini.generateVision(prompt, imageBase64, mimeType);
        return {
          ...res,
          fallbackOccurred: errors.length > 0,
          fallbackDetails: errors.length > 0 ? `Image analyzed using Gemini (${res.modelUsed}).` : undefined,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Gemini Vision failed: ${errMessage}`);
      }
    }

    throw new Error(
      `No vision-capable AI provider was able to process the image.\n• ${errors.join('\n• ')}\n\nPlease ensure a vision-capable model is configured (such as llama-3.2-11b-vision-preview on Groq, or Gemini).`
    );
  }
}

export const orchestrator = new ProviderOrchestrator();
