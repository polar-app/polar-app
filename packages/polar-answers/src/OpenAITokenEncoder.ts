// eslint-disable-next-line @typescript-eslint/no-var-requires
const encoder = require('gpt-3-encoder');

export namespace OpenAITokenEncoder {

    export function encode(text: string): ReadonlyArray<number> {
        return encoder.encode(text);
    }

    export function nrTokens(text: string) {
        return encode(text).length;
    }

}
