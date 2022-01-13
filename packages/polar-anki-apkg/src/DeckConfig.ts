import { FlashcardType } from "polar-shared/src/metadata/FlashcardType";

export interface DeckConfig {
    readonly id: number;
    readonly name: string;
}

export type DeckModels = {
    readonly [K in FlashcardType]: number;
}