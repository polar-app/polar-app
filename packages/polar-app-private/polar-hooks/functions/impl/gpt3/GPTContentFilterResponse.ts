interface IChoice {
    readonly text: 0 | 1 | 2;
}

export interface GPTContentFilterResponse {
    readonly choices: ReadonlyArray<IChoice>;
}
