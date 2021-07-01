import * as React from 'react';
import {deepMemo} from '../react/ReactUtils';
import Box from '@material-ui/core/Box';
import {UL} from './UL';
import {Block} from "./Block";
import {observer} from "mobx-react-lite"
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {NoteBreadcrumbLink} from "./NoteBreadcrumbLink";
import {BlockPredicates} from "./store/BlockPredicates";
import {IBlockPredicates} from "./store/IBlockPredicates";
import {BlocksTreeProvider, useBlocksTreeStore} from './BlocksTree';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

interface InboundNoteRefProps {
    readonly id: BlockIDStr;
    readonly name: string | undefined;
    readonly content: string | undefined;
}

const InboundNoteRef = observer((props: InboundNoteRefProps) => {

    const {id} = props;
    const blocksTreeStore = useBlocksTreeStore();

    const pathToNote = blocksTreeStore.pathToBlock(id);

    return (
        <>

            <div style={{display: 'flex', marginLeft: 20}}>
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
                 }}>

                <BlocksTreeProvider root={id}>
                    <Block parent={undefined} id={id} />
                </BlocksTreeProvider>

            </div>
        </>
    )

});

interface IProps {
    readonly id: BlockIDStr;
}

export const NotesInbound = deepMemo(observer(function NotesInbound(props: IProps) {

    const blocksTreeStore = useBlocksTreeStore();

    const inboundNoteIDs = blocksTreeStore.lookupReverse(props.id);
    const inbound = React.useMemo(() => {
        const blocks = [...blocksTreeStore.idsToBlocks(inboundNoteIDs)].filter(BlockPredicates.isTextBlock);
        return blocks.sort((a, b) => (new Date(b.created)).getTime() - (new Date(a.created).getTime()));
    }, [inboundNoteIDs, blocksTreeStore]);

    if (inbound.length === 0) {
        return null;
    }

    return (
        <div className="NotesInbound">

            <Box color="text.secondary">
                {/* TODO: Maybe use a package here for pluralization or write a helper function somewhere */}
                <h3>All notes that reference this note: { inbound.length } linked reference{inbound.length === 1 ? '' : 's'}.</h3>
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
}));
