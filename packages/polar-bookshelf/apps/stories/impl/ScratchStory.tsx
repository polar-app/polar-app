import IconButton from '@material-ui/core/IconButton';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as React from 'react';
import {FAHomeIcon} from "../../../web/js/mui/MUIFontAwesome";
import {NoteFormatBar} from "../../../web/js/notes/NoteFormatBar";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
        },
        active: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        }
    }));

export const ScratchStory = () => {

    const classes = useStyles();

    return (

        <div>
            <NoteFormatBar/>
        </div>

    );

}
