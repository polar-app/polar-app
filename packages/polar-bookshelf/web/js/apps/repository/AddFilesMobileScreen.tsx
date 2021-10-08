import * as React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core';

import addFile from "polar-assets/src/assets/illustrations/AddFile.svg";

import { Uploads } from './upload/Uploads';
import {AddFileHooks} from "./upload/AddFileHooks";
import useAddFileImporter = AddFileHooks.useAddFileImporter;
import { DocRepoTableToolbar } from '../../../../apps/repository/js/doc_repo/DocRepoTableToolbar';
import { useHistory } from 'react-router-dom';
import { MUIBottomNavigation } from '../../../../web/js/mui/MUIBottomNavigation';
import { BOTTOM_NAV_HEIGHT } from './RepositoryApp';


const useStyles = makeStyles<Theme>((theme) =>
    createStyles({
        root:{
            display: 'flex',
            flexDirection: 'column',
            height: `calc(100% - ${BOTTOM_NAV_HEIGHT}px)`,
            justifyContent: 'center',
            padding: '0 1em '
        },
        container:{
            display: 'flex',
            flexDirection: 'row',
            border: 'solid 1px rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            boxSizing: 'border-box',
            margin: '1em 0',
        },
        image:{
            height: '100%'
        },
        textfield:{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 1em'
        },
        input:{
            display: 'none'
        }
    })
);

/**
 * @author Hadi, 21-September-2021
 * A new screen that opens only for mobile when adding new files, notes, folders..
 */

export const AddFilesMobileScreen = React.memo(function AddFilesMobileScreen(){
    const classes = useStyles();
    const addFileImporter = useAddFileImporter();
    const id = React.useMemo(() => '' + Math.floor(10000 *Math.random()), []);
    const history = useHistory();

    const handleUpload = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const uploads = Uploads.fromFiles(event.target.files);
        addFileImporter(uploads);

        // Go to homepage after upload is triggered
        history.push('/');
    }, [addFileImporter]);

    return(
        <>
            <DocRepoTableToolbar/>

            <div className={classes.root}>
                <label htmlFor={id} className={classes.container}>
                    <img src={addFile} className={classes.image} alt={'Add Files..'} />
                    <div className={classes.textfield}>
                        <h2>Add files</h2>
                        <span>PDF and EPUB supported</span>
                    </div>
                </label>
                <input  className={classes.input}
                        accept="application/pdf, application/epub+zip, .pdf, .epub, .PDF, .EPUB"
                        id={id}
                        multiple
                        onChange={handleUpload}
                        type="file"/>
            </div>
            <MUIBottomNavigation/>
        </>
    );
});