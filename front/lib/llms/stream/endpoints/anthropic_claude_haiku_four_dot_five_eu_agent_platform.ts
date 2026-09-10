import { WithRubyClaudeHaikuFourDotFive } from "@app/lib/llms/providers/anthropic/models/claude_haiku_four_dot_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeHaikuFourDotFiveEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_haiku_four_dot_five_eu_agent_platform";

export class RubyAnthropicClaudeHaikuFourDotFiveEuropeAgentPlatformStream extends WithRubyClaudeHaikuFourDotFive(
  AnthropicClaudeHaikuFourDotFiveEuropeAgentPlatformStream
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
  RubyAnthropicClaudeHaikuFourDotFiveEuropeAgentPlatformStream
);
