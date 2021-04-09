import React from 'react';
import {deepMemo} from "../../../react/ReactUtils";
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {AddFileHooks} from "./AddFileHooks";
import AttachmentIcon from '@material-ui/icons/Attachment';
import {Uploads} from "./Uploads";
import useAddFileImporter = AddFileHooks.useAddFileImporter;

const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      display: 'none',
    },
  }),
);

interface IProps {
    readonly onClose: () => void;
}

export const BrowseFilesToUpload = deepMemo(function BrowseFilesToUpload(props: IProps) {

    const classes = useStyles();
    const id = React.useMemo(() => '' + Math.floor(10000 *Math.random()), []);
    const addFileImporter = useAddFileImporter();

    const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const uploads = Uploads.fromFiles(event.target.files);
        addFileImporter(uploads);
        props.onClose();
    }, [addFileImporter, props]);

    return (
        <>
            <input
                className={classes.input}
                accept="application/pdf, application/epub+zip, .pdf, .epub, .PDF, .EPUB"
                id={id}
                multiple
                onChange={handleInputChange}
                type="file"
            />
            <label htmlFor={id}>
                <Button variant="contained"
                        startIcon={<AttachmentIcon/>}
                        size="large"
                        component="span"
                        color="primary">
                    Upload Files
                </Button>
            </label>
        </>
    );

});
