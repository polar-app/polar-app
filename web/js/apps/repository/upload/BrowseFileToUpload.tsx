import React from 'react';
import {deepMemo} from "../../../react/ReactUtils";
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {AddFileHooks, IUpload} from "./AddFileHooks";
import useAddFileImporter = AddFileHooks.useAddFileImporter;
import AttachmentIcon from '@material-ui/icons/Attachment';

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

export const BrowseFileToUpload = deepMemo((props: IProps) => {

    const classes = useStyles();
    const id = React.useMemo(() => '' + Math.floor(10000 *Math.random()), []);
    const addFileImporter = useAddFileImporter();

    // FIXME: the path is wrong...

    const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {

        function toUpload(file: File): IUpload {

            return {
                blob: file,
                name: file.name,
                // relativePath: file.webkitRelativePath
            };
        }

        // FIXME subdirectory uploads are being attempted... big problem.
        // FXME should we pass the relativePath and compute the tags LATER?
        console.log("FIXME: uploading files: ", event.target.files);

        // FIXME filter these down by type to JUST application/pdf a
        // FIXME: this filte rALSO needs to be done for drag and drop too 
        // when operating on files...
        const files = Array.from(event.target.files || []);
        addFileImporter(files.map(toUpload));

        props.onClose();

    }, [addFileImporter]);

    const inputProps = {
        // this is a hack to add the directory props.
        webkitdirectory: "",
        mozdirectory: "",
        directory: ""
    };

    return (
        <>
            <input
                className={classes.input}
                accept="application/pdf, application/epub+zip, .pdf, .epub, .PDF, .EPUB"
                {...inputProps}
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
                    Browse Files to Upload
                </Button>
            </label>
        </>
    );

});
