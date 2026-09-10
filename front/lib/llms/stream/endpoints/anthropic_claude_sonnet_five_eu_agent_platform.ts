import { WithRubyClaudeSonnetFiveConfig } from "@app/lib/llms/providers/anthropic/models/claude_sonnet_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeSonnetFiveEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_sonnet_five_eu_agent_platform";

export class RubyAnthropicClaudeSonnetFiveEuropeAgentPlatformStream extends WithRubyClaudeSonnetFiveConfig(
  AnthropicClaudeSonnetFiveEuropeAgentPlatformStream
) {
  static readonly endpointFilter = {
    or: [
      {
        featureFlags: { contains: "use_vertex_for_supported_models" as const },
      },
      { isCreditPriced: { eq: true } },
    ],
  };
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeSonnetFiveEuropeAgentPlatformStream
);
