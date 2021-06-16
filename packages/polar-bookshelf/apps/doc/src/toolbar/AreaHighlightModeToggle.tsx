import React from "react";
import {GlobalHotKeys} from "react-hotkeys";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import {usePersistentRouteContext} from "../../../../web/js/apps/repository/PersistentRoute";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {StandardToggleButton} from "../../../repository/js/doc_repo/buttons/StandardToggleButton";

const globalKeyMap = keyMapWithGroup({
    group: "Document Viewer",
    keyMap: {
        TOGGLE: {
            name: "Area Highlight Mode",
            description: "Toggle area higlight mode",
            sequences: [
                {
                    keys: "a",
                    platforms: ['macos', 'linux', 'windows']
                }
            ],
            priority: 1,
        },
    },
});

const escapeMap = { ESCAPE: ['Escape'] };

export const AreaHighlightModeToggle: React.FC = () => {
    const {toggleAreaHighlightMode, setAreaHighlightMode} = useDocViewerCallbacks();
    const {areaHighlightMode}
        = useDocViewerStore(["areaHighlightMode"]);
    const {fileType} = useDocViewerContext();
    const {active} = usePersistentRouteContext();

    const handlers = React.useMemo(() => ({ TOGGLE: toggleAreaHighlightMode}), [toggleAreaHighlightMode]);
    const activeHandlers = React.useMemo(() => ({ ESCAPE: () => setAreaHighlightMode(false)}), [setAreaHighlightMode]);

    if (~["epub"].indexOf(fileType)) {
        return null;
    }

    return (
        <>
            <StandardToggleButton
                onClick={toggleAreaHighlightMode}
                active={areaHighlightMode}
                tooltip="Area highlight mode (a)"
            >
                <PhotoSizeSelectLargeIcon/>
            </StandardToggleButton>
            {active && (
                <>
                    <GlobalKeyboardShortcuts keyMap={globalKeyMap} handlerMap={handlers}/>
                    {areaHighlightMode &&
                        <GlobalHotKeys keyMap={escapeMap} handlers={activeHandlers} />
                    }
                </>
            )}
        </>
    );
};
