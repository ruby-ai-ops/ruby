import { WithRubyGptFiveDotSixSolConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_six_sol";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotSixSolGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_six_sol_global_openai_responses";

export class RubyOpenAIGptFiveDotSixSolGlobalOpenAIResponsesStream extends WithRubyGptFiveDotSixSolConfig(
  OpenAIGptFiveDotSixSolGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotSixSolGlobalOpenAIResponsesStream);
