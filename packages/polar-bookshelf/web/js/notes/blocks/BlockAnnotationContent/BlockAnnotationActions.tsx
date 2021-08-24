import React from "react";
import {createStyles, debounce, Grow, Popper, ClickAwayListener, makeStyles} from "@material-ui/core";
import {ColorStr} from "../../../ui/colors/ColorSelectorBox";
import {ColorMenu} from "../../../ui/ColorMenu";

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

    const handleHide = React.useMemo(() => debounce(() => setHovered(false), 100), [setHovered]);
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
            '& svg': {
                width: 16,
                height: 16,
            },
        },
    })
);

export const BlockAnnotationAction = React.forwardRef<HTMLDivElement, React.PropsWithChildren<IBlockAnnotationActionProps>>((props, ref) => {
    const { icon, onClick, children } = props;
    const classes = useBlockAnnotationActionStyles();

    return (
        <div className={classes.root} onClick={onClick} ref={ref}>
            {icon}
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
    const { onChange, color } = props;

    return (
        <BlockAnnotationAction
            key="color"
            ref={elem => setRef(elem)}
            icon={<ColorIcon color={color} />}
            onClick={() => null}
        >
            {ref &&
                <Popper
                    open={true}
                    anchorEl={ref}
                    placement="left"
                    transition
                >
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                            <div style={{ marginRight: 10 }}>
                                <ClickAwayListener onClickAway={() => null}>
                                    <ColorMenu selected={color} onChange={onChange} />
                                </ClickAwayListener>
                            </div>
                        </Grow>
                    )}
                </Popper>
            }
        </BlockAnnotationAction>
    );
};
