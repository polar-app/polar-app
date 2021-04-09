import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {BrowseFolderToUpload} from "./BrowseFolderToUpload";
import Dialog from '@material-ui/core/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {BrowseFilesToUpload} from "./BrowseFilesToUpload";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dropbox: {
            borderRadius: '10px',
            borderStyle: 'dashed',
            borderWidth: '3px',
            borderColor: theme.palette.primary.light,
            minWidth: '400px',
            minHeight: '250px',
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            padding: '20px'
        },
        title: {
            marginTop: '10px',
            marginBottom: '10px',
            fontSize: '3.5em',
        },
        description: {
            fontSize: '1.7em',
            marginBottom: '10px'
        },
        explainer: {
            fontSize: '1.3em',
            color: theme.palette.text.secondary
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
        },

    }),
);

interface IProps {
    readonly open: boolean;
    readonly noActions?: boolean;
    readonly onClose: () => void;
}

/**
 * Shown while the user is hovering while a file ready to drop.
 */
export const AddFileDropzoneDialog2 = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <Dialog transitionDuration={50}
                maxWidth="lg"
                className={classes.backdrop}
                onClose={props.onClose}
                open={props.open}>

            <div className={classes.dropbox}>

                <p className={classes.title}>
                    Drag and Drop
                </p>

                <p>
                    <CloudUploadIcon style={{fontSize: '75px'}}/>
                </p>

                <p className={classes.description}>
                    Drag and Drop PDF and EPUB files here to upload
                </p>

                <p className={classes.explainer}>
                    Selecting a directory will also include all files in all
                    subdirectories
                </p>

                <div style={{
                         display: 'flex',
                         justifyContent: 'center'
                     }}>
                    <div className="mr-1">
                        <BrowseFilesToUpload onClose={props.onClose}/>
                    </div>
                    <div className="ml-1">
                        <BrowseFolderToUpload onClose={props.onClose}/>
                    </div>
                </div>

            </div>

        </Dialog>

    );

});

