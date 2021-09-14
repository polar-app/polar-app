import * as React from "react";
import IconButton from '@material-ui/core/IconButton/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Promises} from "polar-shared/src/util/Promises";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUILoadingIconButton} from "../../../web/js/mui/MUILoadingIconButton";


export const FeedbackButtonStory = () => {
    return (
        <div>

            <br/>

            <CircularProgress/>

            <br/>

            <IconButton >
                <ThumbUpIcon/>
            </IconButton>

            <br/>

            <IconButton>
                <CircularProgress size={30}/>
            </IconButton>

            <br/>

            <MUILoadingIconButton icon={<ThumbUpIcon/>} onClick={async () => await Promises.waitFor(2000)} onDone={NULL_FUNCTION} onError={NULL_FUNCTION}/>

        </div>
    );
}
