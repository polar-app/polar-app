import React from "react";
import {createStyles, debounce, Grow, Popper, ClickAwayListener, makeStyles, Box} from "@material-ui/core";
import {ColorStr} from "../../../ui/colors/ColorSelectorBox";
import {ColorMenu} from "../../../ui/ColorMenu";
import {useHistory} from "react-router";
import {useAnnotationBlockManager} from "../../NoteUtils";
import {useBlocksTreeStore} from "../../BlocksTree";
import {AnnotationPtrs} from "../../../annotation_sidebar/AnnotationPtrs";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {AnnotationContent} from "../../content/AnnotationContent";
import {AnnotationLinks} from "../../../annotation_sidebar/AnnotationLinks";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import {AnnotationContentType, IFlashcardAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {ITextConverters} from "../../../annotation_sidebar/DocAnnotations";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {Flashcards} from "../../../metadata/Flashcards";
import {Refs} from "polar-shared/src/metadata/Refs";
import {BlockPredicates} from "../../store/BlockPredicates";

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            position: 'relative',
            paddingRight: 30,
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
        <div
            className={classes.root}
            onMouseEnter={handleShow}
            onMouseLeave={handleHide}
        >
            {hovered && <div className={classes.actionsOuter}>{actions}</div>}
            {children}
        </div>
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

type ISharedActionType = 'createFlashcard' | 'changeColor' | 'remove' | 'open';

type ISharedActionMap = {
    [key in ISharedActionType]: React.FC;
}

export const useSharedAnnotationBlockActions = (opts: IUseSharedAnnotationBlockActionsOpts): React.ReactElement[] => {
    const { annotation, id, actions = ['createFlashcard',  'changeColor', 'remove', 'open'] } = opts;
    const blocksTreeStore = useBlocksTreeStore();
    const { update, getBlock } = useAnnotationBlockManager();
    const history = useHistory();

    const handleDelete = React.useCallback(() => {
        blocksTreeStore.deleteBlocks([id]);
    }, [blocksTreeStore, id]);
    
    const handleOpen = React.useCallback(() => {
        const ptr = AnnotationPtrs.create({
            target: annotation.value.id,
            pageNum: annotation.pageNum,
            docID: annotation.docID,
        });
        history.push(AnnotationLinks.createRelativeURL(ptr));
    }, [annotation, history]);

    const handleColorChange = React.useCallback((color: ColorStr) => {
        const block = getBlock(id, annotation.type);
        if (block && BlockPredicates.isAnnotationHighlightBlock(block)) {
            const content = block.content.toJSON();
            content.value.color = color;
            update(id, content);
        }
    }, [update, id, getBlock, annotation.type]);

    const handleCreateFlashcard = React.useCallback(() => {
        const back = annotation.type === AnnotationContentType.TEXT_HIGHLIGHT
            ? ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, annotation.value).text || ''
            : '';

        const content: IFlashcardAnnotationContent = {
            type: AnnotationContentType.FLASHCARD,
            docID: annotation.docID,
            pageNum: annotation.pageNum,
            value: Flashcards.createFrontBack('', back, Refs.create(
                annotation.value.id,
                AnnotationContentType.TEXT_HIGHLIGHT
                    ? 'text-highlight'
                    : 'area-highlight'
            ), 'MARKDOWN'),
        };

        blocksTreeStore.createNewBlock(id, { asChild: true, content });
    }, [blocksTreeStore, id, annotation]);

    const color = annotation.type === AnnotationContentType.TEXT_HIGHLIGHT
                  || annotation.type === AnnotationContentType.AREA_HIGHLIGHT ? annotation.value.color : '';

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
            changeColor: () => <BlockAnnotationColorPickerAction
                color={color}
                onChange={handleColorChange}
            />,
        };

        return Object.entries(actionMap)
            .filter(([key]) => actions.indexOf(key as ISharedActionType) > -1)
            .map(([key, Action]) => <Action key={key} />);
    }, [handleDelete, handleOpen, color, handleColorChange, handleCreateFlashcard, actions]);
};