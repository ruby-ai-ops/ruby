import { WithRubyClaudeOpusFiveConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeOpusFiveGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_five_global_anthropic";

export class RubyAnthropicClaudeOpusFiveGlobalAnthropicStream extends WithRubyClaudeOpusFiveConfig(
  AnthropicClaudeOpusFiveGlobalAnthropicStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyAnthropicClaudeOpusFiveGlobalAnthropicStream);
