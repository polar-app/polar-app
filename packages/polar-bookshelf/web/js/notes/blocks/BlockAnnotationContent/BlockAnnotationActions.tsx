import {createStyles, debounce, makeStyles} from "@material-ui/core";
import React from "react";

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
    icon: ReturnType<React.FC>;
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

export const BlockAnnotationAction: React.FC<IBlockAnnotationActionProps> = (props) => {
    const { icon, onClick, children } = props;
    const classes = useBlockAnnotationActionStyles();

    return (
        <div className={classes.root} onClick={onClick}>
            {icon}
            {children}
        </div>
    );
};
