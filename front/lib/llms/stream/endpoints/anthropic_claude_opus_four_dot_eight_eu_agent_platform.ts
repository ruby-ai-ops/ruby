import { WithRubyClaudeOpusFourDotEightConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_four_dot_eight";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeOpusFourDotEightEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_four_dot_eight_eu_agent_platform";

export class RubyAnthropicClaudeOpusFourDotEightEuropeAgentPlatformStream extends WithRubyClaudeOpusFourDotEightConfig(
  AnthropicClaudeOpusFourDotEightEuropeAgentPlatformStream
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
  RubyAnthropicClaudeOpusFourDotEightEuropeAgentPlatformStream
);
