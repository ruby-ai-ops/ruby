import { WithRubyGptSixAstraConfig } from "@app/lib/llms/providers/openai/models/gpt_six_astra";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptSixAstraGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_six_astra_global_openai_responses";

export class RubyOpenAIGptSixAstraGlobalOpenAIResponsesStream extends WithRubyGptSixAstraConfig(
  OpenAIGptSixAstraGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptSixAstraGlobalOpenAIResponsesStream);
