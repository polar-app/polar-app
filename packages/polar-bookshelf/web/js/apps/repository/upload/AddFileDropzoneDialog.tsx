import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { DropzoneArea } from 'material-ui-dropzone';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {DropEvent} from 'react-dropzone';
import {AddFileHooks} from "./AddFileHooks";
import useAddFileImporter = AddFileHooks.useAddFileImporter;
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {IUpload} from "./IUpload";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '600px',
            maxWidth: '100%'
        },
        textContainer: {
            margin: '5px 15px'
        }
    }),
);

interface IProps {
    readonly open: boolean;
    readonly noActions?: boolean;
    readonly onClose: () => void;
}

export const AddFileDropzoneDialog = React.memo((props: IProps) => {

    const classes = useStyles();
    const addFileImporter = useAddFileImporter();

    function onDrop(files: File[], event: DropEvent) {

        function toUpload(file: File): IUpload {

            return {
                blob: file,
                name: file.name
            };
        }

        props.onClose();
        addFileImporter(files.map(toUpload));

    }

    return (
        <Dialog open={props.open}
                maxWidth="lg"
                onClose={props.onClose}>

            <DialogTitle>
                Upload PDF and EPUB Files
            </DialogTitle>
            <DialogContent>
                <div className="mt-2 mb-4">
                    <DropzoneArea
                        classes={classes}
                        dropzoneText="Drag and drop PDF or EPUB files to Upload"
                        showPreviews={false}
                        showPreviewsInDropzone={false}
                        onDrop={onDrop}
                        acceptedFiles={['application/pdf', 'application/epub+zip']}
                        maxFileSize={500000000}/>
                </div>
            </DialogContent>

            {! props.noActions &&
                <DialogActions>
                    <Button color="primary"
                            onClick={props.onClose}
                            variant="contained">
                        Cancel
                    </Button>
                </DialogActions>}

        </Dialog>

    );

});
