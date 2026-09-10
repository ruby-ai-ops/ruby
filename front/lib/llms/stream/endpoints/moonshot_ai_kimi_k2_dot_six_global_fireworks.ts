import { WithRubyMoonshotAiKimiK2Dot6Config } from "@app/lib/llms/providers/fireworks/models/kimi_k2_dot_six";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { MoonshotAiKimiK2Dot6GlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/moonshot_ai_kimi_k2_dot_six_global_fireworks";

export class RubyMoonshotAiKimiK2Dot6GlobalFireworksStream extends WithRubyMoonshotAiKimiK2Dot6Config(
  MoonshotAiKimiK2Dot6GlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyMoonshotAiKimiK2Dot6GlobalFireworksStream);
