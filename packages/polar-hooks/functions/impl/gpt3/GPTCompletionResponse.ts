interface IChoice {
    readonly text: string;
    // readonly index: number;
    // readonly finish_reason: 'stop' | string;
}

export interface GPTCompletionResponse {
    readonly choices: ReadonlyArray<IChoice>;
}