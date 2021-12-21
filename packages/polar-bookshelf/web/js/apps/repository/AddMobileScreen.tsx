import * as React from 'react';
import {Box, createStyles, makeStyles, Theme} from '@material-ui/core';
import {Uploads} from './upload/Uploads';
import {AddFileHooks} from "./upload/AddFileHooks";
import {useHistory} from 'react-router-dom';
import {AdaptivePageLayout} from "../../../../apps/repository/js/page_layout/AdaptivePageLayout";
import {MUIActionCard} from '../../mui/MUIActionCard';
import {useCreateNoteDialog} from '../../notes/NotesToolbar';
import useAddFileImporter = AddFileHooks.useAddFileImporter;

const useStyles = makeStyles<Theme>(() =>
    createStyles({
        input: {
            display: 'none'
        },
    })
);

/**
 * @author Hadi, 21-September-2021
 * A new screen that opens only for mobile when adding new files, notes, folders..
 */

export const AddMobileScreen = React.memo(function AddMobileScreen(){
    const classes = useStyles();
    const addFileImporter = useAddFileImporter();
    const history = useHistory();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleCreateNoteTrigger = useCreateNoteDialog();

    const handleUpload = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const uploads = Uploads.fromFiles(event.target.files);
        addFileImporter(uploads);

        // Go to homepage after upload is triggered
        history.push('/');
    }, [addFileImporter, history]);

    const handleUploadTrigger = React.useCallback(() => {
        const elem = fileInputRef.current;

        if (! elem) {
            return;
        }

        elem.click();
    }, [fileInputRef]);

    return(
        <AdaptivePageLayout noBack title="Add">

            <Box display="flex"
                 flexDirection="column"
                 alignItems="center"
                 justifyContent="center"
                 gridRowGap="2rem"
                 style={{ height: '100%' }}>

                <input className={classes.input}
                       accept="application/pdf, application/epub+zip, .pdf, .epub, .PDF, .EPUB"
                       ref={fileInputRef}
                       id="file-input"
                       onChange={handleUpload}
                       multiple
                       type="file"/>

                 <MUIActionCard title="Add Documents"
                                description="PDF and EPUB supported"
                                actionButtonTitle="Add"
                                onAction={handleUploadTrigger} />

                 <MUIActionCard title="Create a note"
                                description="Capture all your thoughts"
                                actionButtonTitle="Create"
                                onAction={handleCreateNoteTrigger} />
            </Box>

        </AdaptivePageLayout>
    );
});
