import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import {useDocViewerStore} from "./DocViewerStore";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {ReadingProgressResume} from "../../../web/js/view/ReadingProgressResume";

export const PagemarkProgressBarMenu = () => {

    const store = useDocViewerStore();
    const docMeta = store.docMeta!;

    const handleJump = () => {
        ReadingProgressResume.resume(docMeta);
    }


    return (
        <>
            <MUIMenuItem text="Jump to Last Reading Position"
                         icon={<BookmarkIcon/>}
                         onClick={handleJump}/>

        </>
    );

}
