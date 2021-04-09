import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';
import Box from '@material-ui/core/Box';
import { UL } from './UL';
import {NoteBulletButton} from "./NoteBulletButton";
import {NoteEditor} from "./NoteEditor";
import {BlockIDStr, useNotesStore } from './store/BlocksStore';
import { observer } from "mobx-react-lite"
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {NoteBreadcrumbLink} from "./NoteBreadcrumbLink";

interface InboundNoteRefProps {
    readonly id: BlockIDStr;
    readonly name: string | undefined;
    readonly content: string | undefined;
}

const InboundNoteRef = observer((props: InboundNoteRefProps) => {

    const store = useNotesStore();

    const pathToNote = store.pathToNote(props.id);

    return (
        <>

            <div style={{display: 'flex'}}>
                <Breadcrumbs>
                    {pathToNote.map(current => (
                        <NoteBreadcrumbLink key={current.id}
                                            id={current.id}
                                            content={current.content}/>
                    ))}
                </Breadcrumbs>
            </div>

            <div style={{
                     overflow: 'hidden',
                     // whiteSpace: 'nowrap',
                     // textOverflow: 'ellipsis',
                     // maxWidth: '50ch',
                     display: 'flex'
                 }}>

                <NoteEditor parent={undefined} id={props.id} immutable={true}/>

            </div>
        </>
    )

});

interface IProps {
    readonly id: BlockIDStr;
}

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
