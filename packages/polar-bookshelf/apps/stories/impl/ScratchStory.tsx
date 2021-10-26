import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as React from 'react';
import {BarMode, NoteFormatBar} from "../../../web/js/notes/NoteFormatBar";
import {StoryHolder} from "../StoryHolder";

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
    const [mode, setMode] = React.useState<BarMode>('format');

    return (

        <StoryHolder>
            <div>
                <NoteFormatBar mode={mode} setMode={setMode}/>
            </div>
        </StoryHolder>

    );

}
