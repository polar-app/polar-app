import * as React from 'react';
import {URLStr} from "polar-shared/src/util/Strings";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

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

    function onRemoveFormat() {
        doExecCommand('removeFormat');
    }

    function doLink(link: URLStr) {
        doExecCommand('createlink', link)
    }

    return {onBold, onItalic, onQuote, onUnderline, onStrikethrough, onSubscript, onSuperscript, doLink, onRemoveFormat}

}

export function useNoteFormatKeyboardHandler() {

    const noteFormatHandlers = useNoteFormatHandlers(NULL_FUNCTION);

    return React.useCallback((event: React.KeyboardEvent) => {

        if (event.metaKey || event.ctrlKey) {

            if (! event.shiftKey && ! event.altKey) {

                function abortEvent() {
                    event.stopPropagation();
                    event.preventDefault();
                }

                switch(event.key) {
                    case 'b':
                        noteFormatHandlers.onBold();
                        abortEvent();
                        break;
                    case 'i':
                        noteFormatHandlers.onItalic();
                        abortEvent();
                        break;

                    case 'u':
                        noteFormatHandlers.onUnderline();
                        abortEvent();
                        break;

                }

            }

        }

    }, [noteFormatHandlers]);

}
