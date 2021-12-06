import React from "react";
import {DeviceRouter} from "../../ui/DeviceRouter";
import {NoteFormatBarPopperDesktop} from "./NoteFormatBarPopperDesktop";
import {NoteFormatBarPopperHandheld} from "./NoteFormatBarHandheld/NoteFormatBarPopperHandheld";
import {GlobalKeyboardShortcuts, HandlerMap, keyMapWithGroup} from "../../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useExecCommandExecutor} from "./NoteFormatBarActions";


const annotationBarKeyMap = keyMapWithGroup({
    group: "Notes formatting",
    keyMap: {
        BOLD: {
            name: "Toggle Bold",
            description: "Toggle bold",
            sequences: [{ keys: "ctrl+b", platforms: ['macos', 'windows', 'linux'] }],
        },
        ITALICS: {
            name: "Toggle italics",
            description: "Toggle italics",
            sequences: [{ keys: "ctrl+i", platforms: ['macos', 'windows', 'linux'] }],
        },
        UNDERLINE: {
            name: "Toggle underline",
            description: "Toggle underline",
            sequences: [{ keys: "ctrl+u", platforms: ['macos', 'windows', 'linux'] }],
        },
        STRIKETHROUGH: {
            name: "Toggle strikethrough",
            description: "Toggle strikethrough",
            sequences: [{ keys: "alt+shift+5", platforms: ['macos', 'windows', 'linux'] }],
        },
    },
});

export const NoteFormatBarPopper: React.FC = () => {
    const handleBoldRef = React.useRef(useExecCommandExecutor('bold'));
    const handleItalicRef = React.useRef(useExecCommandExecutor('italic'));
    const handleUnderlineRef = React.useRef(useExecCommandExecutor('underline'));
    const handleStrikeThroughRef = React.useRef(useExecCommandExecutor('strikeThrough'));
    

    const handlers = React.useMemo<HandlerMap>(() => ({
        BOLD: () => handleBoldRef.current(),
        ITALICS: () => handleItalicRef.current(),
        UNDERLINE: () => handleUnderlineRef.current(),
        STRIKETHROUGH: () => handleStrikeThroughRef.current(),
    }), [handleBoldRef, handleItalicRef, handleUnderlineRef, handleStrikeThroughRef]);

    return (
        <>
            <DeviceRouter
                desktop={<NoteFormatBarPopperDesktop />}
                handheld={<NoteFormatBarPopperHandheld />}
            />

            <GlobalKeyboardShortcuts keyMap={annotationBarKeyMap}
                                     handlerMap={handlers} />
        </>
    );
};
