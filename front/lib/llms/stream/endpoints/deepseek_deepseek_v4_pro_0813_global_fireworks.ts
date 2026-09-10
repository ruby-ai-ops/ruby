import { WithRubyDeepSeekDeepSeekV4Pro0813Config } from "@app/lib/llms/providers/fireworks/models/deepseek_v4_pro_0813";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { DeepSeekDeepSeekV4Pro0813GlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/deepseek_deepseek_v4_pro_0813_global_fireworks";

export class RubyDeepSeekDeepSeekV4Pro0813GlobalFireworksStream extends WithRubyDeepSeekDeepSeekV4Pro0813Config(
  DeepSeekDeepSeekV4Pro0813GlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyDeepSeekDeepSeekV4Pro0813GlobalFireworksStream);
