import {URLStr} from "polar-shared/src/util/Strings";

export function useNoteFormatHandlers(onUpdated: () => void) {

    function doExecCommand(command: string, value?: string) {
        console.log('doExecCommand: ' + command);
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

    function doRemoveFormat() {
        doExecCommand('removeFormat');
    }

    return {onBold, onItalic, onQuote, onUnderline, onStrikethrough, onSubscript, onSuperscript, doLink, doRemoveFormat}

}
