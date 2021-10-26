import * as React from 'react';
import {deepMemo} from '../react/ReactUtils';
import Box from '@material-ui/core/Box';
import {Block} from "./Block";
import {observer} from "mobx-react-lite"
import {NoteBreadcrumbLinks} from "./NoteBreadcrumbLink";
import {BlockPredicates} from "./store/BlockPredicates";
import {BlocksTreeProvider, useBlocksTreeStore} from './BlocksTree';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {UL} from './UL';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

interface InboundNoteRefProps {
    readonly id: BlockIDStr;
}

const InboundNoteRef = observer((props: InboundNoteRefProps) => {
    const {id} = props;
    const blocksTreeStore = useBlocksTreeStore();
    const pathToNote = blocksTreeStore.pathToBlock(id).filter(BlockPredicates.isTextBlock);

    return (
        <Box mb={1}>
            <div style={{display: 'flex'}}>
                <NoteBreadcrumbLinks blocks={pathToNote} />
            </div>

            <div style={{
                     overflow: 'hidden',
                 }}>

                <BlocksTreeProvider root={id}>
                    <Block parent={undefined} id={id} />
                </BlocksTreeProvider>

            </div>
        </Box>
    )

});

interface IProps {
    readonly id: BlockIDStr;
}

export const NotesInbound = deepMemo(observer(function NotesInbound(props: IProps) {
    const blocksTreeStore = useBlocksTreeStore();
    const [expanded, setExpanded] = React.useState(true);

    const onToggleExpand = React.useCallback(() => setExpanded(expanded => !expanded), []);

    const inboundNoteIDs = blocksTreeStore.lookupReverse(props.id);

    const inbound = React.useMemo(() => {
        const blocks = [...blocksTreeStore.idsToBlocks(inboundNoteIDs)].filter(BlockPredicates.isEditableBlock);
        return blocks.sort((a, b) => (new Date(b.created)).getTime() - (new Date(a.created).getTime()));
    }, [inboundNoteIDs, blocksTreeStore]);

    if (inbound.length === 0) {
        return null;
    }

    return (
        <div className="NotesInbound">

            <Box color="text.secondary" display="flex" alignItems="center">
                <SectionExpandToggle expanded={expanded} onToggleExpand={onToggleExpand} />

                <h3>Linked references ({ inbound.length })</h3>
            </Box>

            {expanded &&
                <UL>
                    {inbound.map((current, idx) => <InboundNoteRef key={idx} id={current.id} />)}
                </UL>
            }
        </div>
    );
}));


interface ISectionExpandToggleProps {
    readonly style?: React.CSSProperties;
    readonly expanded: boolean;
    readonly onToggleExpand: () => void;
}

export const SectionExpandToggle: React.FC<ISectionExpandToggleProps> = (props) => {
    const { style = {}, expanded, onToggleExpand } = props;

    return (
        <ArrowRightIcon
            onClick={onToggleExpand}
            style={{
                transform: `rotate(${expanded ? 90 : 0}deg)`,
                transformOrigin: 'center',
                fontSize: 26,
                transition: 'transform 100ms ease-in',
                cursor: 'pointer',
                ...style,
            }}
        />
    );
};
