require("../../../../lib/TextHighlighter.js");

declare var global: any;

export class TextHighlighterFactory {

    static newInstance(element: HTMLElement, options: any): any {
        return new global.TextHighlighter(element, options);
    }

}
