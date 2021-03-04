// readonly onBold?: () => void;
// readonly onItalic?: () => void;
// readonly onQuote?: () => void;
// readonly onUnderline?: () => void;
// readonly onStrikethrough?: () => void;
// readonly onSubscript?: () => void;
// readonly onSuperscript?: () => void;
// readonly onLink?: () => void;


export function useNoteFormatHandlers(onUpdated: () => void) {

    function doExecCommand(command: string) {
        document.execCommand(command);
        onUpdated();
    }

    function onBold() {
        doExecCommand('bold');
    }

    function onItalic() {
        doExecCommand('italic');
    }

    function onQuote() {
        // doSelectionWrap('blockquote');
    }

    function onUnderline() {
        doExecCommand('underline')
    }

    function onStrikethrough() {
        doExecCommand('strikeThrough')
    }

    function onSubscript() {
        doExecCommand('subscript')
    }

    function onSuperscript() {
        doExecCommand('superscript')
    }

    return {onBold, onItalic, onQuote, onUnderline, onStrikethrough, onSubscript, onSuperscript}

}
