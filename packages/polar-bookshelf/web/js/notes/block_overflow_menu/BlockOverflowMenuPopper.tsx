import {Box, ClickAwayListener, Grow, Paper, Popper} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr, IBlockContent} from "polar-blocks/src/blocks/IBlock";
import React from "react";
import {useBlocksStore} from "../store/BlocksStore";
import {ColorSelector} from "./actions/ColorSelector";
import {SwitchFlashcardType} from "./actions/SwitchFlashcardType";
import {Open} from "./actions/Open";
import {EditTags} from "./actions/EditTags";
import {CreateAIFlashcard} from "./actions/CreateAIFlashcard";
import {CreateFlashcard} from "./actions/CreateFlashcard";
import {Remove} from "./actions/Remove";
import {useBlockOverflowMenuStore} from "./BlockOverflowMenu";
import {CreateAIClozeFlashcard} from "./actions/CreateAIClozeFlashcard";

export interface IBlockOverflowMenuActionProps {
    readonly id: BlockIDStr;
}

export type IBlockOverflowMenuAction = 'createFlashcard'
                                       | 'createAIFlashcard'
                                       | 'createAIClozeFlashcard'
                                       | 'changeColor'
                                       | 'remove'
                                       | 'open'
                                       | 'editTags'
                                       | 'switchFlashcardType';

export const BLOCK_ACTIONS_BY_TYPE: Record<IBlockContent['type'], ReadonlyArray<IBlockOverflowMenuAction>> = {
    'date': [],
    'name': [],
    'image': [],
    'document': [],
    'markdown': [],
    [AnnotationContentType.AREA_HIGHLIGHT] : ['changeColor', 'createFlashcard', 'editTags', 'open', 'remove'],
    [AnnotationContentType.TEXT_HIGHLIGHT] : ['changeColor', 'createFlashcard', 'createAIFlashcard', 'createAIClozeFlashcard', 'editTags', 'open', 'remove'],
    [AnnotationContentType.FLASHCARD] : ['editTags', 'switchFlashcardType', 'remove'],
};

const BLOCK_ACTION_COMPONENTS: Record<IBlockOverflowMenuAction, React.FC<IBlockOverflowMenuActionProps> | null> = {
    changeColor: ColorSelector,
    switchFlashcardType: SwitchFlashcardType,
    open: Open,
    editTags: EditTags,
    remove: Remove,
    createAIFlashcard: CreateAIFlashcard,
    createFlashcard: CreateFlashcard,
    createAIClozeFlashcard: CreateAIClozeFlashcard,
};

export const BlockOverflowMenuPopper: React.FC = observer(() => {
    const blockOverflowMenuStore = useBlockOverflowMenuStore();

    const { state } = blockOverflowMenuStore;

    const handleClear = React.useCallback(() => {
        blockOverflowMenuStore.clearState();
    }, [blockOverflowMenuStore]);

    if (! state) {
        return null;
    }

    return (
        <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={handleClear}>
            <Popper open
                    anchorEl={state.elem}
                    placement="bottom"
                    disablePortal
                    transition>
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <BlockOverflowMenu id={state.id} />
                    </Grow>
                )}
            </Popper>
        </ClickAwayListener>
    );
});

interface IBlockOverflowMenuProps {
    readonly id: BlockIDStr;
}

export const BlockOverflowMenu: React.FC<IBlockOverflowMenuProps> = (props) => {
    const { id } = props;
    const blocksStore = useBlocksStore();
    const blockOverflowMenuStore = useBlockOverflowMenuStore();
    const block = blocksStore.getBlock(id);

    React.useEffect(() => {
        if (! block) {
            blockOverflowMenuStore.clearState();
        }
    }, [block, blockOverflowMenuStore]);

    const type = block && block.content.type;

    const actions = React.useMemo(() => type ? BLOCK_ACTIONS_BY_TYPE[type] : [], [type]);

    const actionComponents = React.useMemo(() =>
        actions.map(action => {
            const Component = BLOCK_ACTION_COMPONENTS[action];
            return Component ? <Component key={action} id={id} /> : null;
        }), [actions, id]);

    if (! block) {
        return <div>Block type doesn't support any actions</div>;
    }

    return (
        <Paper elevation={5}>
            <Box py={1.5} display="flex" flexDirection="column">
                {actionComponents}
            </Box>
        </Paper>
    );
};
