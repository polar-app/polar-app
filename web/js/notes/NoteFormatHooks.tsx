
// FIXME: we need mapping that our markdown system uses for all of these elements.

import {URLStr} from "polar-shared/src/util/Strings";

export function useNoteFormatHandlers(onUpdated: () => void) {

    // FIXME we need one that's a clear formatting which removes bold, italics, link, etc.

    function doExecCommand(command: string, value?: string) {
        document.execCommand(command, false, value);
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
        // FIXME: this command resets the range selection...
        doExecCommand('strikeThrough')
    }

    function onSubscript() {
        doExecCommand('subscript')
    }

    function onSuperscript() {
        doExecCommand('superscript')
    }

    function doLink(link: URLStr) {
        doExecCommand('createlink', link)
    }

    return {onBold, onItalic, onQuote, onUnderline, onStrikethrough, onSubscript, onSuperscript, doLink}

}
