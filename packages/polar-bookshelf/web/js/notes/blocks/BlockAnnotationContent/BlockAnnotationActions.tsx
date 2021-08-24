import React from "react";
import {createStyles, debounce, Grow, Popper, ClickAwayListener, makeStyles, Box} from "@material-ui/core";
import {ColorStr} from "../../../ui/colors/ColorSelectorBox";
import {ColorMenu} from "../../../ui/ColorMenu";
import {useHistory} from "react-router";
import {useAnnotationBlockManager} from "../../NoteUtils";
import {useBlocksTreeStore} from "../../BlocksTree";
import {AnnotationPtrs} from "../../../annotation_sidebar/AnnotationPtrs";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {AreaHighlightAnnotationContent, TextHighlightAnnotationContent} from "../../content/AnnotationContent";
import {AnnotationLinks} from "../../../annotation_sidebar/AnnotationLinks";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

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
    active?: boolean;
}

export const BlockAnnotationActionsWrapper: React.FC<IBlockAnnotationActionsWrapperProps> = (props) => {
    const { children, actions, active } = props;
    const classes = useStyles();
    const [hovered, setHovered] = React.useState(false);

    const handleHide = React.useMemo(() => debounce(() => setHovered(false), 300), [setHovered]);
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
            {(active || hovered) && <div className={classes.actionsOuter}>{actions}</div>}
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
            width: '1em',
            height: '1em',
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
    readonly id: BlockIDStr;
    readonly annotation: TextHighlightAnnotationContent | AreaHighlightAnnotationContent;
}

export const useSharedAnnotationBlockActions = (opts: IUseSharedAnnotationBlockActionsOpts) => {
    const { annotation, id } = opts;
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
        const block = getBlock(id, AnnotationContentType.TEXT_HIGHLIGHT);
        if (block) {
            const content = block.content.toJSON();
            content.value.color = color;
            update(id, content);
        }
    }, [update, id, getBlock]);

    const color = annotation.value.color

    return React.useMemo(() => [
        <BlockAnnotationAction key="delete" icon={<DeleteIcon />} onClick={handleDelete} />,
        <BlockAnnotationAction key="open" icon={<OpenInNewIcon />} onClick={handleOpen} />,
        <BlockAnnotationColorPickerAction key="color" color={color} onChange={handleColorChange} />,
    ], [handleDelete, handleOpen, color, handleColorChange]);
};
