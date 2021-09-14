export namespace GPTCompletionPrompts {

    const standard = `
Text: Human life expectancy in the US is 78 years which is 2 years less than in Germany.
QQQ: What is human life expectancy in the US?
AAA: 78 years
-----

The US has had 45 presidents and Dwight D. Eisenhower was president in 1955.
QQQ: Who was president of the US in 1955?
AAA: Dwight D. Eisenhower
-----

Text: The United States was founded in 1776. Its population is 320 million.
QQQ: When was the United States founded?
AAA: 320 million
-----

Text: Dwight D. Eisenhower was a US General and the president of the United States in 1955 and had three wives.
QQQ: How many wives did Dwight D. Eisenhower have?
AAA: Three
-----
`

    const extended = `
Text: Human life expectancy in the US is 78 years which is 2 years less than in Germany.
QQQ: What is human life expectancy in the US?
AAA: 78 years
-----

The US has had 45 presidents and Dwight D. Eisenhower was president in 1955.
QQQ: Who was president of the US in 1955?
AAA: Dwight D. Eisenhower
-----

Text: The United States was founded in 1776. Its population is 320 million.
QQQ: When was the United States founded?
AAA: 320 million
-----

Text: Dwight D. Eisenhower was a US General and the president of the United States in 1955 and had three wives.
QQQ: How many wives did Dwight D. Eisenhower have?
AAA: Three
-----

Text: President of the French Republic is the head of state and head of executive of France as well as the Commander-in-Chief of the French Armed Forces.
QQQ: Who is the Commander-in-Chief of the French Armed Forces?
AAA: The President of the French Republic.
-----

Text: Sacramento is the Capital of California.
QQQ: What is the Capital of California?
AAA: Sacramento
-----
`

    interface IPrompts {
        readonly standard: string;
        readonly extended: string;

    }

    const PROMPTS: IPrompts = {
        standard,
        extended
    }

    // tslint:disable-next-line:variable-name
    export function create(key: keyof IPrompts, query_text: string) {

        const basePrompt = PROMPTS[key];

        return `${basePrompt}\nText: ${query_text.trim()}\nQQQ:`

    }

    type PromptText = string;
    type PromptQuestion = string;
    type PromptAnswer = string;

    function toEntry(text: PromptText, question: PromptQuestion, answer: PromptAnswer) {
        return `Text: ${text}\nQQQ: ${question}\nAAA: ${answer}\n----`;
    }

}