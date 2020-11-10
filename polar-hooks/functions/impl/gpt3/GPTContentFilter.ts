export namespace GPTContentFilter {

    export type Classification = 'safe' | 'sensitive' | 'unsafe';

    export async function exec(text: ReadonlyArray<string>): Promise<Classification> {

        return 'unsafe';

    }

}