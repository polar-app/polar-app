// readonly onBold?: () => void;
// readonly onItalic?: () => void;
// readonly onQuote?: () => void;
// readonly onUnderline?: () => void;
// readonly onStrikethrough?: () => void;
// readonly onSubscript?: () => void;
// readonly onSuperscript?: () => void;
// readonly onLink?: () => void;


export function useNoteFormatHandlers(onUpdated: () => void) {

    function doSelectionWrap(tagName: string) {

        const selection = window.getSelection();

        if (! selection) {
            return;
        }

        const range = selection.getRangeAt(0);

        const wrapper = document.createElement(tagName);

        range.surroundContents(wrapper);

        onUpdated();

    }

    function onBold() {
        doSelectionWrap('b');
    }

    function onItalic() {
        doSelectionWrap('i');
    }

    function onQuote() {
        doSelectionWrap('blockquote');
    }

    function onUnderline() {
        doSelectionWrap('u');
    }

    function onStrikethrough() {
        doSelectionWrap('s');
    }

    function onSubscript() {
        doSelectionWrap('sub');
    }

    function onSuperscript() {
        doSelectionWrap('sup');
    }

    return {onBold, onItalic, onQuote, onUnderline, onStrikethrough, onSubscript, onSuperscript}

}
