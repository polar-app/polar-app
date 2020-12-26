import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';
import Box from '@material-ui/core/Box';
import { UL } from './UL';
import {NoteBulletButton} from "./NoteBulletButton";
import {NoteEditor} from "./NoteEditor";
import {NoteIDStr, useNotesStore } from './NotesStore2';
import { observer } from "mobx-react-lite"

interface IProps {
    readonly id: NoteIDStr;
}

interface InboundNoteRefProps {
    readonly id: NoteIDStr;
    readonly name: string | undefined;
    readonly content: string | undefined;
}

const InboundNoteRef = observer((props: InboundNoteRefProps) => {

    return (
        <div style={{
                 overflow: 'hidden',
                 // whiteSpace: 'nowrap',
                 // textOverflow: 'ellipsis',
                 // maxWidth: '50ch',
                 display: 'flex'
             }}>

            <NoteBulletButton target={props.id}/>

            <NoteEditor parent={undefined} id={props.id} immutable={true}/>

        </div>
    )

});

export const NotesInbound = deepMemo(function NotesInbound(props: IProps) {

    const store = useNotesStore();

    const inboundNoteIDs = store.lookupReverse(props.id);
    const inbound = store.lookup(inboundNoteIDs);

    return (
        <div className="NotesInbound">

            <Box color="text.secondary">
                <h3>All notes that reference this note:</h3>
            </Box>

            <UL>
                <>
                    {inbound.map((current, idx) => <InboundNoteRef key={idx}
                                                                   id={current.id}
                                                                   name={current.content}
                                                                   content={current.content}/>)}
                </>
            </UL>
        </div>
    );
});