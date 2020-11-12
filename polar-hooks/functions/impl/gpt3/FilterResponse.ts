interface IChoice {
    readonly text: number;
}

export interface FilterResponse {
    readonly choices: ReadonlyArray<IChoice>;
}
