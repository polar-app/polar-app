interface IChoice {
    readonly text: number;
}

export interface GPTContentFilterResponse {
    readonly choices: ReadonlyArray<IChoice>;
}
