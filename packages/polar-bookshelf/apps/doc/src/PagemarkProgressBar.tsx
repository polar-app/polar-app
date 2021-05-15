import {DocMetas} from "../../../web/js/metadata/DocMetas";
import * as React from "react";
import { LinearProgress, useTheme } from "@material-ui/core";
import {MUIPaperToolbar} from "../../../web/js/mui/MUIPaperToolbar";
import {useDocViewerStore} from "./DocViewerStore";
import {ReadingProgressResume} from "../../../web/js/view/ReadingProgressResume";
import {
    createContextMenu,
    useContextMenu
} from "../../repository/js/doc_repo/MUIContextMenu";
import {PagemarkProgressBarMenu} from "./PagemarkProgressBarMenu";
import useReadingProgressResume = ReadingProgressResume.useReadingProgressResume;
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {ZenModeActiveContainer} from "../../../web/js/mui/ZenModeActiveContainer";

export const ProgressBar = deepMemo(function ProgressBar() {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const [, resumeProgressHandler] = useReadingProgressResume();
    const contextMenuHandlers = useContextMenu();
    const theme = useTheme();

    if (! docMeta) {
        return null;
    }

    const perc = DocMetas.computeProgress(docMeta);

    const handleDoubleClick = () => {
        resumeProgressHandler();
    }

    return (
        <LinearProgress {...contextMenuHandlers}
                  value={perc * 100}
                  variant="determinate"
                  onDoubleClick={handleDoubleClick}
                  className="mt-auto mb-auto"
                  style={{
                    background: theme.palette.grey['300'],
                    width: '100%',
                    height: 6,
                    borderRadius: 9999,
                  }}/>
    );

});

export const PagemarkProgressBar = React.memo(function PagemarkProgressBar() {

    const ContextMenu = React.useMemo(() => createContextMenu(PagemarkProgressBarMenu), []);

    return (
        <ZenModeActiveContainer>
            <ContextMenu>
                <MUIPaperToolbar borderBottom>

                    <div style={{
                             display: 'flex',
                             alignItems: "center"
                         }}
                         className="p-2">

                        <ProgressBar/>

                    </div>

                </MUIPaperToolbar>
            </ContextMenu>
        </ZenModeActiveContainer>
    );

});
