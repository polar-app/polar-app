export namespace NoteActions {

    export function isActionPosition(text: string, position: number) {

    }

    export function computePromptFromText(text: string, start: number, end: number): string | undefined {

        if (start >= 2) {
            // we're doing this only when we're not the first character
            const prefix = text.substring(start - 2, start - 1);
            if (prefix !== ' ') {
                return undefined;
            }
        }

        return text.substring(start, end);
    }

}