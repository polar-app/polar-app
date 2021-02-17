import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column'
        },
        textarea: {
            border: 'none',
            outline: 'none',
            background: 'inherit',
            color: 'inherit',

            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            whiteSpace: 'inherit',
            padding: '0px'


            // FIXME: how do I get the

            // -webkit-box-shadow: none;
            // -moz-box-shadow: none;
            // box-shadow: none;
        }
    }),
);

// major things to test...

// placement of the cursor within the text including when it's converted to markdown...


// https://stackoverflow.com/questions/34968174/set-text-cursor-position-in-a-textarea
// https://medium.com/@endyourif/set-cursor-position-of-textarea-with-javascript-99f5fda0d83f

const ActiveEditor = () => {
    return null;
}

const TextAreaMarkdownEditor = () => {

    const classes = useStyles();

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {

        if (event.currentTarget instanceof HTMLTextAreaElement) {
            const element = event.currentTarget;
            element.selectionStart = 1;
            element.selectionEnd = 5;
        }

    }, []);

    return (
        <textarea className={classes.textarea}
                  onClick={handleClick}
                  rows={1}
                  defaultValue="this is some text"
                  style={{resize: 'none'}}/>
    );

}

export const TextAreaMarkdownEditorStory = () => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TextAreaMarkdownEditor/>
            <div>
                this is some text
            </div>
        </div>
    );

}
