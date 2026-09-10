import { WithRubyGoogleGeminiThreeDotOneFlashLiteConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_1_flash_lite";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotOneFlashLiteEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_1_flash_lite_eu_agent_platform";

export class RubyGoogleGeminiThreeDotOneFlashLiteEuropeAgentPlatformStream extends WithRubyGoogleGeminiThreeDotOneFlashLiteConfig(
  GoogleGeminiThreeDotOneFlashLiteEuropeAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotOneFlashLiteEuropeAgentPlatformStream
);
