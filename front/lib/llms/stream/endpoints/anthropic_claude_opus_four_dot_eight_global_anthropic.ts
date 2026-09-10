import { WithRubyClaudeOpusFourDotEightConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_four_dot_eight";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeOpusFourDotEightGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_four_dot_eight_global_anthropic";

export class RubyAnthropicClaudeOpusFourDotEightGlobalAnthropicStream extends WithRubyClaudeOpusFourDotEightConfig(
  AnthropicClaudeOpusFourDotEightGlobalAnthropicStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeOpusFourDotEightGlobalAnthropicStream
);
