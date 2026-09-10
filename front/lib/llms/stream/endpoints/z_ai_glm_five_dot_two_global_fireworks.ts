import { WithRubyZAiGlm52Config } from "@app/lib/llms/providers/fireworks/models/glm_five_dot_two";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { ZAiGlmFiveDotTwoGlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/z_ai_glm_five_dot_two_global_fireworks";

export class RubyZAiGlmFiveDotTwoGlobalFireworksStream extends WithRubyZAiGlm52Config(
  ZAiGlmFiveDotTwoGlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyZAiGlmFiveDotTwoGlobalFireworksStream);
