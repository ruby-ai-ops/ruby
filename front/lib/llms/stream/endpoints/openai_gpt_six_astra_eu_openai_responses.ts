import { WithRubyGptSixAstraConfig } from "@app/lib/llms/providers/openai/models/gpt_six_astra";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptSixAstraEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_six_astra_eu_openai_responses";

export class RubyOpenAIGptSixAstraEuropeOpenAIResponsesStream extends WithRubyGptSixAstraConfig(
  OpenAIGptSixAstraEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptSixAstraEuropeOpenAIResponsesStream);
