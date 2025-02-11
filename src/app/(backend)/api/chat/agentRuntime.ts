import { getLLMConfig } from '@/config/llm';
import { JWTPayload } from '@/constants/auth';
import { AgentRuntime, ModelProvider } from '@/libs/agent-runtime';

import apiKeyManager from './apiKeyManager';

export interface AgentChatOptions {
  enableTrace?: boolean;
  provider: string;
}

/**
 * Retrieves the options object from environment and apikeymanager
 * based on the provider and payload.
 *
 * @param provider - The model provider.
 * @param payload - The JWT payload.
 * @returns The options object.
 */
const getLlmOptionsFromPayload = (provider: string, payload: JWTPayload) => {
  switch (provider) {
    default: // Use Openai options as default
    case ModelProvider.OpenAI: {
      const { OPENAI_API_KEY, OPENAI_PROXY_URL } = getLLMConfig();
      const openaiApiKey = payload?.apiKey || OPENAI_API_KEY;
      const baseURL = payload?.endpoint || OPENAI_PROXY_URL;
      const apiKey = apiKeyManager.pick(openaiApiKey);
      return {
        apiKey,
        baseURL,
      };
    }
    case ModelProvider.Azure: {
      const { AZURE_API_KEY, AZURE_API_VERSION, AZURE_ENDPOINT } = getLLMConfig();
      const apiKey = apiKeyManager.pick(payload?.apiKey || AZURE_API_KEY);
      const endpoint = payload?.endpoint || AZURE_ENDPOINT;
      const apiVersion = payload?.azureApiVersion || AZURE_API_VERSION;
      return {
        apiVersion,
        apikey: apiKey,
        endpoint,
      };
    }
    case ModelProvider.ZhiPu: {
      const { ZHIPU_API_KEY } = getLLMConfig();
      const apiKey = apiKeyManager.pick(payload?.apiKey || ZHIPU_API_KEY);
      return {
        apiKey,
      };
    }
    case ModelProvider.Google: {
      const { GOOGLE_API_KEY, GOOGLE_PROXY_URL } = getLLMConfig();
      const apiKey = apiKeyManager.pick(payload?.apiKey || GOOGLE_API_KEY);
      const baseURL = payload?.endpoint || GOOGLE_PROXY_URL;
      return {
        apiKey,
        baseURL,
      };
    }
    case ModelProvider.Moonshot: {
      const { MOONSHOT_API_KEY, MOONSHOT_PROXY_URL } = getLLMConfig();
      const apiKey = apiKeyManager.pick(payload?.apiKey || MOONSHOT_API_KEY);
      return {
        apiKey,
        baseURL: MOONSHOT_PROXY_URL,
      };
    }
    case ModelProvider.Bedrock: {
      const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SESSION_TOKEN } =
        getLLMConfig();
      let accessKeyId: string | undefined = AWS_ACCESS_KEY_ID;
      let accessKeySecret: string | undefined = AWS_SECRET_ACCESS_KEY;
      let region = AWS_REGION;
      let sessionToken: string | undefined = AWS_SESSION_TOKEN;
      // if the payload has the api key, use user
      if (payload.apiKey) {
        accessKeyId = payload?.awsAccessKeyId;
        accessKeySecret = payload?.awsSecretAccessKey;
        sessionToken = payload?.awsSessionToken;
        region = payload?.awsRegion;
      }
      return { accessKeyId, accessKeySecret, region, sessionToken };
    }
    case ModelProvider.Ollama: {
      const { OLLAMA_PROXY_URL } = getLLMConfig();
      const baseURL = payload?.endpoint || OLLAMA_PROXY_URL;
      return { baseURL };
    }
    case ModelProvider.Perplexity: {
      const { PERPLEXITY_API_KEY, PERPLEXITY_PROXY_URL } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || PERPLEXITY_API_KEY);
      const baseURL = payload?.endpoint || PERPLEXITY_PROXY_URL;

      return { apiKey, baseURL };
    }
    case ModelProvider.Anthropic: {
      const { ANTHROPIC_API_KEY, ANTHROPIC_PROXY_URL } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || ANTHROPIC_API_KEY);
      const baseURL = payload?.endpoint || ANTHROPIC_PROXY_URL;

      return { apiKey, baseURL };
    }
    case ModelProvider.Minimax: {
      const { MINIMAX_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || MINIMAX_API_KEY);

      return { apiKey };
    }

    case ModelProvider.Groq: {
      const { GROQ_API_KEY, GROQ_PROXY_URL } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || GROQ_API_KEY);
      const baseURL = payload?.endpoint || GROQ_PROXY_URL;

      return { apiKey, baseURL };
    }
    case ModelProvider.Github: {
      const { GITHUB_TOKEN } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || GITHUB_TOKEN);

      return { apiKey };
    }
    case ModelProvider.OpenRouter: {
      const { OPENROUTER_API_KEY } = getLLMConfig();
      const apiKey = apiKeyManager.pick(payload?.apiKey || OPENROUTER_API_KEY);

      return { apiKey };
    }
    case ModelProvider.DeepSeek: {
      const { DEEPSEEK_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || DEEPSEEK_API_KEY);

      return { apiKey };
    }
    case ModelProvider.TogetherAI: {
      const { TOGETHERAI_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || TOGETHERAI_API_KEY);

      return { apiKey };
    }
    case ModelProvider.FireworksAI: {
      const { FIREWORKSAI_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || FIREWORKSAI_API_KEY);

      return { apiKey };
    }
    case ModelProvider.ZeroOne: {
      const { ZEROONE_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || ZEROONE_API_KEY);

      return { apiKey };
    }
    case ModelProvider.Qwen: {
      const { QWEN_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || QWEN_API_KEY);

      return { apiKey };
    }
    case ModelProvider.Stepfun: {
      const { STEPFUN_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || STEPFUN_API_KEY);

      return { apiKey };
    }
    case ModelProvider.Novita: {
      const { NOVITA_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || NOVITA_API_KEY);

      return { apiKey };
    }
    case ModelProvider.Baichuan: {
      const { BAICHUAN_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || BAICHUAN_API_KEY);

      return { apiKey };
    }

    case ModelProvider.Ai360: {
      const { AI360_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || AI360_API_KEY);

      return { apiKey };
    }
    case ModelProvider.Spark: {
      const { SPARK_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || SPARK_API_KEY);

      return { apiKey };
    }
    case ModelProvider.Hunyuan: {
      const { HUNYUAN_API_KEY } = getLLMConfig();

      const apiKey = apiKeyManager.pick(payload?.apiKey || HUNYUAN_API_KEY);

      return { apiKey };
    }
  }
};

/**
 * Initializes the agent runtime with the user payload in backend
 * @param provider - The provider name.
 * @param payload - The JWT payload.
 * @param params
 * @returns A promise that resolves when the agent runtime is initialized.
 */
export const initAgentRuntimeWithUserPayload = (
  provider: string,
  payload: JWTPayload,
  params: any = {},
) => {
  return AgentRuntime.initializeWithProviderOptions(provider, {
    [provider]: { ...getLlmOptionsFromPayload(provider, payload), ...params },
  });
};
