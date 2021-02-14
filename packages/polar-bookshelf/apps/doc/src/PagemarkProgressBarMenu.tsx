import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {ReadingProgressResume} from "../../../web/js/view/ReadingProgressResume";
import useReadingProgressResume = ReadingProgressResume.useReadingProgressResume;

export const PagemarkProgressBarMenu = () => {

    const [active, handler] = useReadingProgressResume();

    return (
        <>
            <MUIMenuItem text="Jump to Last Reading Position"
                         icon={<BookmarkIcon/>}
                         disabled={! active}
                         onClick={handler}/>

        </>
    );

}
