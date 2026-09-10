import { WithRubyClaudeOpusFourDotSixConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_four_dot_six";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeOpusFourDotSixGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_four_dot_six_global_anthropic";

export class RubyAnthropicClaudeOpusFourDotSixGlobalAnthropicStream extends WithRubyClaudeOpusFourDotSixConfig(
  AnthropicClaudeOpusFourDotSixGlobalAnthropicStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeOpusFourDotSixGlobalAnthropicStream
);
