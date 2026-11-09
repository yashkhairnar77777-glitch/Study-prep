import { GroqProvider } from './groqProvider.js';
import { OpenRouterProvider } from './openrouterProvider.js';
import { GeminiProvider } from './geminiProvider.js';
import { ChatMessage, ProviderResponse, ProviderStatusInfo } from './types.js';

export class ProviderOrchestrator {
  private gemini: GeminiProvider;
  private groq: GroqProvider;
  private openrouter: OpenRouterProvider;

  constructor() {
    this.gemini = new GeminiProvider();
    this.groq = new GroqProvider();
    this.openrouter = new OpenRouterProvider();
  }

  public getStatus(): ProviderStatusInfo {
    const geminiCfg = this.gemini.getConfig();
    const groqCfg = this.groq.getConfig();
    const openrouterCfg = this.openrouter.getConfig();

    let primary: ProviderStatusInfo['primary'] = 'none';
    let secondary: ProviderStatusInfo['secondary'] = 'none';
    let tertiary: ProviderStatusInfo['tertiary'] = 'none';

    // Priority Order: Gemini (Primary) -> Groq (2nd Fallback) -> OpenRouter (3rd Fallback)
    if (geminiCfg.configured) {
      primary = 'gemini';
      if (groqCfg.configured) {
        secondary = 'groq';
        if (openrouterCfg.configured) {
          tertiary = 'openrouter';
        }
      } else if (openrouterCfg.configured) {
        secondary = 'openrouter';
      }
    } else if (groqCfg.configured) {
      primary = 'groq';
      if (openrouterCfg.configured) {
        secondary = 'openrouter';
      }
    } else if (openrouterCfg.configured) {
      primary = 'openrouter';
    }

    return {
      gemini: geminiCfg,
      groq: groqCfg,
      openrouter: openrouterCfg,
      primary,
      secondary,
      tertiary,
    };
  }

  public async executeChat(
    messages: ChatMessage[],
    options?: {
      preferredProvider?: 'auto' | 'gemini' | 'groq' | 'openrouter';
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<ProviderResponse> {
    const preferred = options?.preferredProvider || 'auto';
    const errors: string[] = [];

    // If a specific provider was explicitly requested and is configured:
    if (preferred !== 'auto') {
      if (preferred === 'gemini' && this.gemini.isConfigured()) {
        try {
          return await this.gemini.generateChat(messages, options);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Gemini (explicitly requested): ${msg}`);
          console.warn(`[Provider Orchestrator] Explicitly requested Gemini failed, continuing to fallback chain: ${msg}`);
        }
      } else if (preferred === 'groq' && this.groq.isConfigured()) {
        try {
          return await this.groq.generateChat(messages, options);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Groq (explicitly requested): ${msg}`);
          console.warn(`[Provider Orchestrator] Explicitly requested Groq failed, continuing to fallback chain: ${msg}`);
        }
      } else if (preferred === 'openrouter' && this.openrouter.isConfigured()) {
        try {
          return await this.openrouter.generateChat(messages, options);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`OpenRouter (explicitly requested): ${msg}`);
          console.warn(`[Provider Orchestrator] Explicitly requested OpenRouter failed, continuing to fallback chain: ${msg}`);
        }
      }
    }

    // Standard Fallback Flow: Gemini (Primary) -> Groq (2nd Fallback) -> OpenRouter (3rd Fallback)
    // 1. Primary: Google Gemini
    if (this.gemini.isConfigured()) {
      try {
        const result = await this.gemini.generateChat(messages, options);
        return result;
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Gemini (Primary) failed: ${errMessage}`);
        console.warn(`[Provider Orchestrator] Gemini (Primary) error, attempting second fallback (Groq): ${errMessage}`);
      }
    } else {
      errors.push('Gemini (Primary) is not configured in environment (GEMINI_API_KEY missing).');
    }

    // 2. Second Fallback: Groq
    if (this.groq.isConfigured()) {
      try {
        const result = await this.groq.generateChat(messages, options);
        return {
          ...result,
          fallbackOccurred: true,
          fallbackDetails: `Response served by second fallback provider Groq (${result.modelUsed}) after Gemini encountered an issue.`,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Groq (Second Fallback) failed: ${errMessage}`);
        console.warn(`[Provider Orchestrator] Groq (Second Fallback) error, attempting third fallback (OpenRouter): ${errMessage}`);
      }
    } else {
      errors.push('Groq (Second Fallback) is not configured in environment (GROQ_API_KEY missing).');
    }

    // 3. Third Fallback: OpenRouter
    if (this.openrouter.isConfigured()) {
      try {
        const result = await this.openrouter.generateChat(messages, options);
        return {
          ...result,
          fallbackOccurred: true,
          fallbackDetails: `Response served by third fallback provider OpenRouter (${result.modelUsed}) after Gemini and Groq were unavailable.`,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`OpenRouter (Third Fallback) failed: ${errMessage}`);
        console.warn(`[Provider Orchestrator] OpenRouter (Third Fallback) error: ${errMessage}`);
      }
    } else {
      errors.push('OpenRouter (Third Fallback) is not configured in environment (OPENROUTER_API_KEY missing).');
    }

    // If all configured providers failed, provide transparent, informative error
    const failureSummary = errors.join('\n• ');
    throw new Error(
      `All configured AI providers failed to complete the request.\n• ${failureSummary}\n\nPlease check your API keys or rate limits in your environment settings and try again.`
    );
  }

  public async executeVision(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    preferredProvider?: 'auto' | 'gemini' | 'groq' | 'openrouter'
  ): Promise<ProviderResponse> {
    const preferred = preferredProvider || 'auto';
    const errors: string[] = [];

    // If a specific provider was explicitly requested and configured:
    if (preferred !== 'auto') {
      if (preferred === 'gemini' && this.gemini.isConfigured()) {
        try {
          return await this.gemini.generateVision(prompt, imageBase64, mimeType);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Gemini Vision (explicit): ${msg}`);
        }
      } else if (preferred === 'groq' && this.groq.isConfigured()) {
        try {
          return await this.groq.generateVision(prompt, imageBase64, mimeType);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Groq Vision (explicit): ${msg}`);
        }
      } else if (preferred === 'openrouter' && this.openrouter.isConfigured()) {
        try {
          return await this.openrouter.generateVision(prompt, imageBase64, mimeType);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`OpenRouter Vision (explicit): ${msg}`);
        }
      }
    }

    // Standard Fallback Flow:
    // 1. Primary: Gemini Vision (native multimodal)
    if (this.gemini.isConfigured()) {
      try {
        const res = await this.gemini.generateVision(prompt, imageBase64, mimeType);
        return res;
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Gemini Vision (Primary) failed: ${errMessage}`);
        console.warn(`[Provider Orchestrator] Gemini Vision error, attempting second fallback (Groq): ${errMessage}`);
      }
    } else {
      errors.push('Gemini (Primary) is not configured in environment (GEMINI_API_KEY missing).');
    }

    // 2. Second Fallback: Groq Vision if configured
    if (this.groq.isConfigured()) {
      try {
        const res = await this.groq.generateVision(prompt, imageBase64, mimeType);
        return {
          ...res,
          fallbackOccurred: true,
          fallbackDetails: `Image analyzed using second fallback Groq vision model (${res.modelUsed}).`,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Groq Vision (Second Fallback) failed: ${errMessage}`);
        console.warn(`[Provider Orchestrator] Groq Vision error, attempting third fallback (OpenRouter): ${errMessage}`);
      }
    } else {
      errors.push('Groq (Second Fallback) is not configured in environment (GROQ_API_KEY missing).');
    }

    // 3. Third Fallback: OpenRouter Vision if configured
    if (this.openrouter.isConfigured()) {
      try {
        const res = await this.openrouter.generateVision(prompt, imageBase64, mimeType);
        return {
          ...res,
          fallbackOccurred: true,
          fallbackDetails: `Image analyzed using third fallback OpenRouter vision model (${res.modelUsed}).`,
        };
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : String(err);
        errors.push(`OpenRouter Vision (Third Fallback) failed: ${errMessage}`);
      }
    } else {
      errors.push('OpenRouter (Third Fallback) is not configured in environment (OPENROUTER_API_KEY missing).');
    }

    throw new Error(
      `No vision-capable AI provider was able to process the image.\n• ${errors.join('\n• ')}\n\nPlease ensure a vision-capable model is configured (such as Gemini, or Groq llama-3.2-11b-vision-preview).`
    );
  }
}

export const orchestrator = new ProviderOrchestrator();
