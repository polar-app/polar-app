export namespace NoteActions {

    export function computePromptFromText(text: string, start: number, end: number) {
        return text.substring(start, end);
    }

}