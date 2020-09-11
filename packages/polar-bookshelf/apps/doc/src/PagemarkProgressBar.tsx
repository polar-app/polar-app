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

export const ProgressBar = React.memo(() => {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const [resumeProgressActive, resumeProgressHandler] = useReadingProgressResume();

    if (! docMeta) {
        return null;
    }

    const perc = DocMetas.computeProgress(docMeta);

    const handleDoubleClick = () => {
        resumeProgressHandler();
    }

    const contextMenuHandlers = useContextMenu();

    return (
        <progress {...contextMenuHandlers}
                  value={perc}
                  onDoubleClick={handleDoubleClick}
                  className="mt-auto mb-auto"
                  style={{flexGrow: 1}}/>
    );

}, isEqual);

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
