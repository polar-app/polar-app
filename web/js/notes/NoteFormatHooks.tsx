
// FIXME: we need mapping that our markdown system uses for all of these elements.

export function useNoteFormatHandlers(onUpdated: () => void) {

    // FIXME we need one that's a clear formatting which removes bold, italics, link, etc.

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
