import { WithRubyGoogleGeminiThreeDotEightFlashConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_8_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotEightFlashEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_8_flash_eu_agent_platform";

export class RubyGoogleGeminiThreeDotEightFlashEuropeAgentPlatformStream extends WithRubyGoogleGeminiThreeDotEightFlashConfig(
  GoogleGeminiThreeDotEightFlashEuropeAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotEightFlashEuropeAgentPlatformStream
);
