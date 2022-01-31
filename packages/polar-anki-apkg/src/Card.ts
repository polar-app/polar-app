export type Card = CardContent & {
    readonly timestamp: number;
}

export interface CardContent {
    content: ReadonlyArray<string>
}