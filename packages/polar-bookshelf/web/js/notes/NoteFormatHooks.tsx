import * as React from 'react';
import {URLStr} from "polar-shared/src/util/Strings";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { BlockType } from './store/BlocksStore';

export function useNoteFormatHandlers(type: BlockType | undefined, onUpdated: () => void) {

    const doExecCommand = React.useCallback((command: string, value?: string) => {

        if (type !== 'markdown') {
            return;
        }

        console.log('doExecCommand: ' + command);
        document.execCommand(command, false, value);
        onUpdated();

    }, [onUpdated, type]);

    const onBold = React.useCallback(() => {
        doExecCommand('bold');
    }, [doExecCommand]);

    const onItalic = React.useCallback(() => {
        doExecCommand('italic');
    }, [doExecCommand]);

    const onQuote = React.useCallback(() => {
        // doSelectionWrap('blockquote');
    }, []);

    const onUnderline = React.useCallback(() => {
        // underline is disabled but we need a key binding for it so that we can
        // override the native contenteditable hooks in the browser.
    }, []);

    const onStrikethrough = React.useCallback(() => {
        // FIXME: this command resets the range selection...
        doExecCommand('strikeThrough')
    }, [doExecCommand]);

    const onSubscript = React.useCallback(() => {
        doExecCommand('subscript')
    }, [doExecCommand]);

    const onSuperscript = React.useCallback(() => {
        doExecCommand('superscript')
    }, [doExecCommand]);

    const onRemoveFormat = React.useCallback(() => {
        doExecCommand('removeFormat');
    }, [doExecCommand]);

    const doLink = React.useCallback((link: URLStr) => {
        doExecCommand('createlink', link)
    }, [doExecCommand]);

    return {onBold, onItalic, onQuote, onUnderline, onStrikethrough, onSubscript, onSuperscript, doLink, onRemoveFormat}

}

export function useNoteFormatKeyboardHandler(type: BlockType | undefined, onUpdated: () => void = NULL_FUNCTION) {

    const noteFormatHandlers = useNoteFormatHandlers(type, onUpdated);

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
