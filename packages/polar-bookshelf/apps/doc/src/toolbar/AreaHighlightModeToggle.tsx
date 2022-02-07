import React from "react";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import {usePersistentRouteContext} from "../../../../web/js/apps/repository/PersistentRoute";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {StandardToggleButton} from "../../../repository/js/doc_repo/buttons/StandardToggleButton";
import {InputEscapeListener} from "../../../../web/js/mui/complete_listeners/InputEscapeListener";
import {Devices} from "polar-shared/src/util/Devices";
import {useBlockAreaHighlight} from "../../../../web/js/notes/HighlightBlocksHooks";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";

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
    const {active} = usePersistentRouteContext();
    const {toggleAreaHighlightMode, setAreaHighlightMode} = useDocViewerCallbacks();
    const {areaHighlightMode, page: pageNum, docMeta, docScale}
        = useDocViewerStore(["areaHighlightMode", "page", "docMeta", "docScale"]);
    const {fileType} = useDocViewerContext();
    const {create: createBlockAreaHighlight} = useBlockAreaHighlight();
    const docViewerElements = useDocViewerElementsContext();

    const handlers = React.useMemo(() => ({ TOGGLE: toggleAreaHighlightMode}), [toggleAreaHighlightMode]);

    const handleEscape = React.useCallback(() => setAreaHighlightMode(false), [setAreaHighlightMode]);

    const handleToggleAreaHighlightMode = React.useCallback(() => {
        toggleAreaHighlightMode();

        if (! Devices.isDesktop()) {
            if (! docMeta || ! docScale || areaHighlightMode) {
                return;
            }

            const pageMeta = docMeta.pageMetas[pageNum];

            if (! pageMeta) {
                return;
            }

            const rect = {
                left: 30,
                top: 30,
                width: 150,
                height: 150,
            };
            const docViewerElement = docViewerElements.getDocViewerElement();

            createBlockAreaHighlight(docMeta.docInfo.fingerprint, {
                pageNum,
                fileType,
                docScale,
                docViewerElement,
                rect,
            }).catch(console.error);
        }
    }, [toggleAreaHighlightMode, docMeta, docScale, pageNum, docViewerElements, areaHighlightMode, createBlockAreaHighlight, fileType]);

    if (fileType === "epub") {
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
                onClick={handleToggleAreaHighlightMode}
                active={areaHighlightMode}
                tooltip="Area highlight mode (a)">

                <PhotoSizeSelectLargeIcon/>

            </StandardToggleButton>

        </>
    );
};
