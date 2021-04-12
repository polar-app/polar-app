import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";
import { NoteStyle } from "./NoteStyle";
import { BlockIDStr } from "./store/BlocksStore";
import { useBlocksStore } from "./store/BlocksStore";
import { observer } from "mobx-react-lite"
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import { ActionMenuStoreProvider } from "../mui/action_menu/ActionStore";

interface IProps {
    readonly target: BlockIDStr;
}

export const NoteRoot = observer((props: IProps) => {

    // useLifecycleTracer('NoteRoot', {target: props.target});

    const {target} = props;

    const blocksStore = useBlocksStore();

    const note = blocksStore.getBlockByTarget(target)

    React.useEffect(() => {
        // TODO: do this with one init() operation so it mutates the store just once.

        if (note) {
            blocksStore.setRoot(note.id);
            blocksStore.setActive(note.id);
        } else {
            console.warn("No note for target: ", target);
        }

    }, [note, blocksStore, target])

    if (! note) {
        return (
            <div>No note for target: {props.target}</div>
        );
    }

    const id = note?.id;

    return (
        <ActionMenuStoreProvider>
            <NoteSelectionHandler style={{flexGrow: 1}}>
                <NoteStyle>
                    <MUIBrowserLinkStyle style={{flexGrow: 1}}>

                        <Note parent={undefined} id={id}/>

                        <NotesInbound id={id}/>

                    </MUIBrowserLinkStyle>
                    <ActionMenuPopup/>
                </NoteStyle>
            </NoteSelectionHandler>
        </ActionMenuStoreProvider>
    );

});
