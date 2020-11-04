import {DocMetas} from "../../../web/js/metadata/DocMetas";
import * as React from "react";
import {MUIPaperToolbar} from "../../../web/js/mui/MUIPaperToolbar";
import isEqual from "react-fast-compare";
import {useDocViewerStore} from "./DocViewerStore";
import {ReadingProgressResume} from "../../../web/js/view/ReadingProgressResume";
import {
    createContextMenu,
    useContextMenu
} from "../../repository/js/doc_repo/MUIContextMenu";
import {PagemarkProgressBarMenu} from "./PagemarkProgressBarMenu";
import useReadingProgressResume = ReadingProgressResume.useReadingProgressResume;
import {deepMemo} from "../../../web/js/react/ReactUtils";

export const ProgressBar = deepMemo(() => {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const [, resumeProgressHandler] = useReadingProgressResume();
    const contextMenuHandlers = useContextMenu();

    if (! docMeta) {
        return null;
    }

    const perc = DocMetas.computeProgress(docMeta);

    const handleDoubleClick = () => {
        resumeProgressHandler();
    }

    return (
        <progress {...contextMenuHandlers}
                  value={perc}
                  onDoubleClick={handleDoubleClick}
                  className="mt-auto mb-auto"
                  style={{flexGrow: 1}}/>
    );

});

export const PagemarkProgressBar = React.memo(() => {

    const ContextMenu = React.useMemo(() => createContextMenu(PagemarkProgressBarMenu), []);

    return (
        <ContextMenu>
            <MUIPaperToolbar borderBottom>

                <div style={{
                         display: 'flex',
                         alignItems: "center"
                     }}
                     className="p-1">

                    <ProgressBar/>

                </div>

            </MUIPaperToolbar>
        </ContextMenu>
    );

}, isEqual);
