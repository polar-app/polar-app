import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NoteStyle} from "./NoteStyle";
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import {NotesToolbar} from "./NotesToolbar";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {createStyles, makeStyles} from "@material-ui/core";
import {RouteComponentProps} from "react-router-dom";
import {DailyNotesRenderer, SingleNoteRendrer} from "./NoteRenderers";

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


export const NoteProviders: React.FC = ({ children }) => {
    const classes = useStyles();

    return (
        <ActionMenuStoreProvider>
            <NoteSelectionHandler style={{ height: '100%' }}>
                <NoteStyle>
                    <MUIBrowserLinkStyle className={classes.noteOuter}>
                        <NotesToolbar />
                        {children}
                        <ActionMenuPopup />
                    </MUIBrowserLinkStyle>
                </NoteStyle>
            </NoteSelectionHandler>
        </ActionMenuStoreProvider>
    );
};


interface INoteRootParams {
    id: BlockIDStr;
};

export const NoteRoot: React.FC<RouteComponentProps<INoteRootParams>> = (props) => {
    const { match: { params } } = props;

    return (
        <NoteProviders>
            {params.id ? <SingleNoteRendrer target={params.id} /> : <DailyNotesRenderer />}
        </NoteProviders>
    );
};
