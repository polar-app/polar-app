export interface DeckConfig {
    id: number;
    name: string;
    card: Template;
}

export interface Template {
    fields: Array<string>;
    template: {
        question: string;
        answer: string;
    }
    styleText?: string;
}