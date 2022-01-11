import React from "react";
import {DeviceRouter} from "../../ui/DeviceRouter";
import {NoteFormatBarPopperDesktop} from "./NoteFormatBarPopperDesktop";
import {NoteFormatBarPopperPhone} from "./NoteFormatBarPhone/NoteFormatBarPopperPhone";
import {GlobalKeyboardShortcuts, HandlerMap, keyMapWithGroup} from "../../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useNoteFormatBarActions} from "./NoteFormatBarActions";
import {NoteFormatBarPopperTablet} from "./NoteFormatBarPopperTablet";

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

    const { handleBold, handleItalic, handleUnderline, handleStrikeThrough } = useNoteFormatBarActions();

    const handleBoldRef = React.useRef(handleBold);
    const handleItalicRef = React.useRef(handleItalic);
    const handleUnderlineRef = React.useRef(handleUnderline);
    const handleStrikeThroughRef = React.useRef(handleStrikeThrough);
    

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
                phone={<NoteFormatBarPopperPhone />}
                tablet={<NoteFormatBarPopperTablet />}
            />

            <GlobalKeyboardShortcuts keyMap={annotationBarKeyMap}
                                     handlerMap={handlers} />
        </>
    );
};
