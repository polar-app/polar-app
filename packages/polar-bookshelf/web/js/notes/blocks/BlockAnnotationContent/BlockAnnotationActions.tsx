import React from "react";
import {Box, ClickAwayListener, createStyles, debounce, Grow, makeStyles, Popper, CircularProgress} from "@material-ui/core";
import {ColorStr} from "../../../ui/colors/ColorSelectorBox";
import {ColorMenu} from "../../../ui/ColorMenu";
import {useHistory} from "react-router";
import {useBlocksTreeStore} from "../../BlocksTree";
import {AnnotationPtrs} from "../../../annotation_sidebar/AnnotationPtrs";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {
    AnnotationContent,
    AreaHighlightAnnotationContent,
    TextHighlightAnnotationContent
} from "../../content/AnnotationContent";
import {AnnotationLinks} from "../../../annotation_sidebar/AnnotationLinks";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockPredicates} from "../../store/BlockPredicates";
import {useAnnotationBlockManager} from "../../HighlightBlocksHooks";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {useBlockTagEditorDialog} from "../../NoteUtils";
import {useAIFlashcardVerifiedAction} from "../../../../../apps/repository/js/ui/AIFlashcardVerifiedAction";
import {useAutoFlashcardBlockCreator} from "../../../annotation_sidebar/AutoFlashcardHook";
import FlashAutoIcon from "@material-ui/icons/FlashAuto";

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        },
        contentWrapper: {
            flex: '1',
        },
        actionsWrapper: {
            width: 30,
            flex: '0 0 30px',
            position: 'relative',
        },
        actionsOuter: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10,
            '& > div + div': {
                marginTop: 4,
            },
        },
    }),
);

interface IBlockAnnotationActionsWrapperProps {
    actions: React.ReactElement<IBlockAnnotationActionProps>[];
}

export const BlockAnnotationActionsWrapper: React.FC<IBlockAnnotationActionsWrapperProps> = (props) => {
    const { children, actions } = props;
    const classes = useStyles();
    const [hovered, setHovered] = React.useState(false);

    const handleHide = React.useMemo(() => debounce(() => setHovered(false), 50), [setHovered]);
    const handleShow = React.useCallback(() => {
        handleHide.clear();
        setHovered(true);
    }, [setHovered, handleHide]);

    return (
        <ClickAwayListener onClickAway={handleHide}>
            <div
                className={classes.root}
                onMouseEnter={handleShow}
                onMouseLeave={handleHide}
                onClick={handleShow}
            >

                <div className={classes.contentWrapper}>
                    {children}
                </div>
                <div className={classes.actionsWrapper}>
                    {hovered && <div className={classes.actionsOuter}>{actions}</div>}
                </div>
            </div>
        </ClickAwayListener>
    );
};



interface IBlockAnnotationActionProps {
    icon: React.ReactElement;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const useBlockAnnotationActionStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: 20,
            height: 20,
            background: theme.palette.text.primary,
            color: theme.palette.background.default,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        actionIcon: {
            width: 16,
            height: 16,
        },
    })
);

export const BlockAnnotationAction = React.forwardRef<HTMLDivElement, React.PropsWithChildren<IBlockAnnotationActionProps>>((props, ref) => {
    const { icon, onClick, children } = props;
    const classes = useBlockAnnotationActionStyles();

    return (
        <div className={classes.root} onClick={onClick} ref={ref}>
            {React.cloneElement(icon, { className: classes.actionIcon })}
            {children}
        </div>
    );
});


export const useColorIconStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: `1px solid ${theme.palette.background.default}`,
        }
    })
);

interface IColorIconProps {
    color?: ColorStr;
}

const ColorIcon: React.FC<IColorIconProps> = ({ color = 'yellow' }) => {
    const classes = useColorIconStyles();

    return (
        <div className={classes.root} style={{ backgroundColor: color }} />
    );
};

interface IBlockAnnotationColorPickerActionProps {
    color?: ColorStr;
    onChange: (color: ColorStr) => void;
}

export const BlockAnnotationColorPickerAction: React.FC<IBlockAnnotationColorPickerActionProps> = (props) => {
    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
    const [paletteOpen, setPaletteOpen] = React.useState(false);
    const { onChange, color } = props;

    return (
        <BlockAnnotationAction
            key="color"
            ref={elem => setRef(elem)}
            icon={<ColorIcon color={color} />}
            onClick={() => setPaletteOpen(! paletteOpen)}
        >
            {ref &&
                <Popper
                    open={paletteOpen}
                    anchorEl={ref}
                    placement="left"
                    disablePortal
                    transition
                >
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                            <Box boxShadow={5} style={{ marginRight: 10 }}>
                                <ClickAwayListener onClickAway={() => null}>
                                    <ColorMenu selected={color} onChange={onChange} />
                                </ClickAwayListener>
                            </Box>
                        </Grow>
                    )}
                </Popper>
            }
        </BlockAnnotationAction>
    );
};

interface IUseSharedAnnotationBlockActionsOpts {
    id: BlockIDStr;
    annotation: AnnotationContent;
    actions?: ISharedActionType[];
}

export type ISharedActionType = 'createFlashcard' | 'createAIFlashcard' | 'changeColor' | 'remove' | 'open' | 'editTags';

type ISharedActionMap = {
    [key in ISharedActionType]: React.FC;
}

export const useSharedAnnotationBlockActions = (opts: IUseSharedAnnotationBlockActionsOpts): React.ReactElement[] => {
    const { annotation, id, actions = ['createFlashcard', 'createAIFlashcard',  'changeColor', 'remove', 'open'] } = opts;
    const blocksTreeStore = useBlocksTreeStore();
    const { getBlock, createFlashcard } = useAnnotationBlockManager();
    const history = useHistory();
    const blockTagEditorDialog = useBlockTagEditorDialog();
    const [aiFlashcardCreatorState, aiFlashcardCreatorHandler] = useAutoFlashcardBlockCreator();

    const verifiedAction = useAIFlashcardVerifiedAction();

    const handleDelete = React.useCallback(() => {
        blocksTreeStore.deleteBlocks([id]);
    }, [blocksTreeStore, id]);

    const handleOpen = React.useCallback(() => {
        const ptr = AnnotationPtrs.create({
            target: id,
            pageNum: annotation.pageNum,
            docID: annotation.docID,
        });
        history.push(AnnotationLinks.createRelativeURL(ptr));
    }, [annotation.docID, annotation.pageNum, history, id]);

    const handleColorChange = React.useCallback((color: ColorStr) => {
        const block = getBlock(id, annotation.type);
        if (block && BlockPredicates.isAnnotationHighlightBlock(block)) {
            const contentJSON = block.content.toJSON();

            switch (contentJSON.type) {
                case AnnotationContentType.TEXT_HIGHLIGHT:
                    blocksTreeStore.setBlockContent(id, new TextHighlightAnnotationContent({
                        ...contentJSON,
                        value: { ...contentJSON.value, color },
                    }));
                    break;
                case AnnotationContentType.AREA_HIGHLIGHT:
                    blocksTreeStore.setBlockContent(id, new AreaHighlightAnnotationContent({
                        ...contentJSON,
                        value: { ...contentJSON.value, color },
                    }));
                    break;
            }
        }
    }, [blocksTreeStore, id, getBlock, annotation.type]);

    const handleCreateFlashcard = React.useCallback(() => {
        const back = annotation.type === AnnotationContentType.TEXT_HIGHLIGHT
            ? BlockTextHighlights.toText(annotation.value)
            : '';

        createFlashcard(id, { type: FlashcardType.BASIC_FRONT_BACK, front: '', back });
    }, [id, annotation, createFlashcard]);

    const handleCreateAIFlashcard = React.useCallback(() => {
        if (annotation.type !== AnnotationContentType.TEXT_HIGHLIGHT) {
            return console.error("AI flashcards can only be created under text highlights!");
        }

        verifiedAction(() => {
            aiFlashcardCreatorHandler(id, BlockTextHighlights.toText(annotation.value))
                .catch((e) => console.error("Could not handle verified action: ", e));
        });
    }, [id, verifiedAction, aiFlashcardCreatorHandler, annotation]);

    const color = annotation.type === AnnotationContentType.TEXT_HIGHLIGHT
                  || annotation.type === AnnotationContentType.AREA_HIGHLIGHT ? annotation.value.color : '';

    const editTags = React.useCallback(() => {
        blockTagEditorDialog([id]);
    }, [blockTagEditorDialog, id]);

    return React.useMemo(() => {
        const actionMap: ISharedActionMap = {
            remove: () => <BlockAnnotationAction
                icon={<DeleteIcon />}
                onClick={handleDelete}
            />,
            open: () => <BlockAnnotationAction
                icon={<OpenInNewIcon />}
                onClick={handleOpen}
            />,
            createFlashcard: () => <BlockAnnotationAction
                icon={<FlashOnIcon />}
                onClick={handleCreateFlashcard}
            />,
            createAIFlashcard: () => <BlockAnnotationAction
                icon={aiFlashcardCreatorState === 'idle'
                    ? <FlashAutoIcon />
                    : <CircularProgress size="100%" color="secondary" /> }
                onClick={handleCreateAIFlashcard}
            />,
            changeColor: () => <BlockAnnotationColorPickerAction
                color={color}
                onChange={handleColorChange}
            />,
            editTags: () => <BlockAnnotationAction
                icon={<LocalOfferIcon />}
                onClick={editTags}
            />
        };

        return Object.entries(actionMap)
            .filter(([key]) => actions.indexOf(key as ISharedActionType) > -1)
            .map(([key, Action]) => <Action key={key} />);
    }, [
        handleDelete,
        handleOpen,
        color,
        editTags,
        handleColorChange,
        handleCreateFlashcard,
        aiFlashcardCreatorState,
        handleCreateAIFlashcard,
        actions,
    ]);
};
