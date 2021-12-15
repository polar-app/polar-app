import * as React from 'react';
import {Box, createStyles, LinearProgress, makeStyles} from '@material-ui/core';
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NoteStyle} from "./NoteStyle";
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import {BlockOverflowMenuProvider} from './block_overflow_menu/BlockOverflowMenu';
import {BlockFormatBarProvider} from './note_format_bar/NoteFormatBar';
import {useBlocksStore} from './store/BlocksStore';
import {observer} from 'mobx-react-lite';

const useStyles = makeStyles(() =>
    createStyles({
        noteOuter: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            height: '100%',
        },
    }),
);


export const NoteProviders: React.FC = observer(({ children }) => {
    const classes = useStyles();
    const blocksStore = useBlocksStore();

    if (! blocksStore.hasSnapshot) {
        return <LinearProgress />;
    }

    return (
        <Box className="NoteRoot"
             style={{ height: '100%', width: '100%' }}
             display="flex"
             flexDirection="column">

            <ActionMenuStoreProvider>
                <BlockFormatBarProvider>
                    <BlockOverflowMenuProvider>
                        <NoteSelectionHandler style={{ flex: 1, minHeight: 0 }}>
                            <NoteStyle>
                                <MUIBrowserLinkStyle className={classes.noteOuter}>
                                    {children}
                                    <ActionMenuPopup />
                                </MUIBrowserLinkStyle>
                            </NoteStyle>
                        </NoteSelectionHandler>
                    </BlockOverflowMenuProvider>
                </BlockFormatBarProvider>
            </ActionMenuStoreProvider>

        </Box>
    );
});
