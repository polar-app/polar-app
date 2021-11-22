import React from "react";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import {usePersistentRouteContext} from "../../../../web/js/apps/repository/PersistentRoute";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {StandardToggleButton} from "../../../repository/js/doc_repo/buttons/StandardToggleButton";
import {InputEscapeListener} from "../../../../web/js/mui/complete_listeners/InputEscapeListener";

const globalKeyMap = keyMapWithGroup({
    group: "Document Viewer",
    keyMap: {
        TOGGLE: {
            name: "Area Highlight Mode",
            description: "Toggle area highlight mode",
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


export const AreaHighlightModeToggle: React.FC = () => {
    const {toggleAreaHighlightMode, setAreaHighlightMode} = useDocViewerCallbacks();
    const {areaHighlightMode}
        = useDocViewerStore(["areaHighlightMode"]);
    const {fileType} = useDocViewerContext();
    const {active} = usePersistentRouteContext();

    const handlers = React.useMemo(() => ({ TOGGLE: toggleAreaHighlightMode}), [toggleAreaHighlightMode]);

    const handleEscape = React.useCallback(() => setAreaHighlightMode(false), [setAreaHighlightMode]);

    if (~["epub"].indexOf(fileType)) {
        return null;
    }

    return (
        <>
            {active && (
                <>
                    <GlobalKeyboardShortcuts keyMap={globalKeyMap} handlerMap={handlers}/>
                    {areaHighlightMode && <InputEscapeListener onEscape={handleEscape}/>}
                </>
            )}

            <StandardToggleButton
                onClick={toggleAreaHighlightMode}
                active={areaHighlightMode}
                tooltip="Area highlight mode (a)">
                <PhotoSizeSelectLargeIcon/>
            </StandardToggleButton>

        </>
    );
};
