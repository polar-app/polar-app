import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';
import Box from '@material-ui/core/Box';
import { UL } from './UL';
import {BlockEditor} from "./BlockEditor";
import {BlockIDStr, useBlocksStore } from './store/BlocksStore';
import { observer } from "mobx-react-lite"
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {NoteBreadcrumbLink} from "./NoteBreadcrumbLink";
import {BlockPredicates} from "./store/BlockPredicates";
import {IBlockPredicates} from "./store/IBlockPredicates";

interface InboundNoteRefProps {
    readonly id: BlockIDStr;
    readonly name: string | undefined;
    readonly content: string | undefined;
}

const InboundNoteRef = observer((props: InboundNoteRefProps) => {

    const blocksStore = useBlocksStore();

    const pathToNote = blocksStore.pathToBlock(props.id);

    return (
        <>

            <div style={{display: 'flex'}}>
                <Breadcrumbs>

                    {pathToNote.filter(BlockPredicates.isTextBlock)
                               .map(current => <NoteBreadcrumbLink key={current.id}
                                                                   id={current.id}
                                                                   content={current.content.data}/>)}

                </Breadcrumbs>
            </div>

            <div style={{
                     overflow: 'hidden',
                     // whiteSpace: 'nowrap',
                     // textOverflow: 'ellipsis',
                     // maxWidth: '50ch',
                     display: 'flex'
                 }}>

                <BlockEditor parent={undefined} id={props.id} immutable={true}/>

            </div>
        </>
    )

});

interface IProps {
    readonly id: BlockIDStr;
}

export const NotesInbound = deepMemo(function NotesInbound(props: IProps) {

    const blocksStore = useBlocksStore();

    const inboundNoteIDs = blocksStore.lookupReverse(props.id);
    const inbound = blocksStore.lookup(inboundNoteIDs);

    return (
        <div className="NotesInbound">

            <Box color="text.secondary">
                <h3>All notes that reference this note:</h3>
            </Box>

            <UL>
                <>
                    {inbound.filter(IBlockPredicates.isTextBlock)
                            .map((current, idx) => <InboundNoteRef key={idx}
                                                                   id={current.id}
                                                                   name={current.content.data}
                                                                   content={current.content.data}/>)}
                </>
            </UL>
        </div>
    );
});
