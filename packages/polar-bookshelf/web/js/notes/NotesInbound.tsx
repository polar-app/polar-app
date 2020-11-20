import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';
import {NoteIDStr, useNotesStore, useNotesStoresCallbacks} from "./NotesStore";
import Box from '@material-ui/core/Box';

interface IProps {
    readonly id: NoteIDStr;
}

interface InboundNoteRefProps {
    readonly name: string | undefined;
    readonly content: string | undefined;
}

const InboundNoteRef = deepMemo((props: InboundNoteRefProps) => {

    return (
        <div style={{
                 overflow: 'hidden',
                 whiteSpace: 'nowrap',
                 textOverflow: 'ellipsis',
                 maxWidth: '50ch'
             }}>

            {props.content}

        </div>
    )

});

export const NotesInbound = deepMemo((props: IProps) => {

    useNotesStore(['reverse', 'index']);
    const {lookupReverse, lookup} = useNotesStoresCallbacks();

    const inboundNoteIDs = lookupReverse(props.id);
    const inbound = lookup(inboundNoteIDs);

    return (
        <div>
            <Box color="text.secondary">
                <h3>All notes that reference this note:</h3>
            </Box>

            {inbound.map((current, idx) => <InboundNoteRef key={idx}
                                                           name={current.name}
                                                           content={current.content}/>)}

        </div>
    );
});