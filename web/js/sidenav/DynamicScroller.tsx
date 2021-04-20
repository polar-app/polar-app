import React from "react";
import ExpandMore from '@material-ui/icons/ExpandMore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import {debounce} from 'throttle-debounce';
import {Theme} from "@material-ui/core";
import clsx from "clsx";
import {fade} from '@material-ui/core/styles/colorManipulator';


type UseArrowStylesProps = {
    direction: "up" | "down";
};
const useArrowStyles = makeStyles<Theme, UseArrowStylesProps>((theme) => createStyles({
    arrowOuter({ direction }) {
        const position = direction === 'up' ? 'top' : 'bottom';
        const gradDirection = direction === 'up' ? 'bottom' : 'top';
        return {
            [position]: 0,
            left: 0,
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: 16,
            color: theme.palette.text.primary,
            zIndex: 10,
            [`&::${direction === 'up' ? 'after' : 'before'}`]: {
                content: '""',
                display: 'block',
                height: 20,
                width: '100%',
                background: `linear-gradient(to ${gradDirection}, ${theme.palette.background.default} 20%, ${fade(theme.palette.background.default, 0)} 100%)`,
            }
        };
    },
    arrowIcon: {
        background: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
}));

type ScrollArrowProps = {
    direction: "up" | "down";
    onClick: React.MouseEventHandler<HTMLDivElement>;
};

const ScrollArrow: React.FC<ScrollArrowProps> = ({ direction, onClick }) => {
    const classes = useArrowStyles({ direction });

    const icon = direction === "down" ? <ExpandMore /> : <ExpandLess />;

    return (
        <div className={classes.arrowOuter} onClick={onClick}>
            <div className={classes.arrowIcon}>
                { icon }
            </div>
        </div>
    );
};

const useVDSStyles = makeStyles(() => createStyles({
    scrollerOuter: {
        position: 'relative',
        display: 'flex',
    },
    contentOuter: {
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        maxHeight: '100%',
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    contentInner: {
        transition: 'transform 150ms cubic-bezier(0.05, 0, 0, 1)',
        willChange: 'transform',
        '&::before, &::after' : {
            content: '" "',
            display: 'table',
        },
    }
}));

const getNewScroll = (parentHeight: number, height: number, newScroll: number) => {
    if (height < parentHeight) {
        return 0;
    }

    return Math.max(0, Math.min(height - parentHeight, newScroll));
};

export type VerticalDynamicScrollerProps = {
    clickScrollAmount ?: number;
    style ?: React.CSSProperties;
    className ?: string;
};

export const VerticalDynamicScroller: React.FC<VerticalDynamicScrollerProps> = (props) => {
    const {
        children,
        clickScrollAmount = 90,
        style = {},
        className = '',
    } = props;
    const classes = useVDSStyles();

    const innerRef = React.useRef<HTMLDivElement>(document.createElement('div'));
    const parentRef = React.useRef<HTMLDivElement>(document.createElement('div'));

    const [innerHeight, setInnerHeight] = React.useState(0);
    const [parentHeight, setParentHeight] = React.useState(999999);
    const [scrollUpShown, setScrollUpShown] = React.useState(false);
    const [scrollDownShown, setScrollDownShown] = React.useState(false);


    const updateArrows = React.useCallback((scrollPos: number, parentHeight: number, innerHeight: number) => {
        if (scrollPos > 0 && !scrollUpShown) {
            setScrollUpShown(true);
        } else if (scrollPos === 0 && scrollUpShown) {
            setScrollUpShown(false);
        }

        const maxScroll = Math.floor(innerHeight - parentHeight);
        if (scrollPos < maxScroll && !scrollDownShown) {
            setScrollDownShown(true);
        } else if (scrollPos >= maxScroll && scrollDownShown) {
            setScrollDownShown(false);
        }
    }, [scrollDownShown, scrollUpShown]);

    const handleScroll = React.useCallback((delta: number): React.MouseEventHandler<HTMLDivElement> => {
        return () => {
            const newScroll = getNewScroll(parentHeight, innerHeight, parentRef.current.scrollTop + delta);
            parentRef.current.scrollTo(0, newScroll);
        };
    }, [innerHeight, parentHeight]);

    React.useEffect(() => {
        const parentElem = parentRef.current;
        const onScroll = () => {
            updateArrows(Math.ceil(parentElem.scrollTop), parentHeight, innerHeight);
        };
        parentElem.addEventListener('scroll', onScroll);
        return () => parentElem.removeEventListener('scroll', onScroll);
    }, [parentHeight, innerHeight, updateArrows]);

    React.useEffect(() => {
        const parentElem = parentRef.current;
        const innerElem = innerRef.current;
        const resizeObserver = new ResizeObserver(debounce(50, (entries) => {
            let innerHeight: number = innerElem.getBoundingClientRect().height;
            let parentHeight: number = parentElem.getBoundingClientRect().height;
            for (const entry of entries) {
                const { target, contentRect: { height } } = entry;
                if (target === parentRef.current) {
                    parentHeight = height;
                } else if (target === innerRef.current) {
                    innerHeight = height;
                }
            }
            setInnerHeight(innerHeight);
            setParentHeight(parentHeight);
            updateArrows(Math.ceil(parentElem.scrollTop), parentHeight, innerHeight);
        }));
        resizeObserver.observe(parentElem);
        resizeObserver.observe(innerElem);

        return () => resizeObserver.disconnect();
    }, [setInnerHeight, setParentHeight, updateArrows]);

    const arrowsShown = parentHeight < innerHeight && parentHeight > 100;

    return  (
        <div className={clsx(classes.scrollerOuter, className)}>
            {(arrowsShown && scrollUpShown) &&
                <ScrollArrow direction="up" onClick={handleScroll(-clickScrollAmount)} />
            }
            <div ref={parentRef} style={style} className={classes.contentOuter}>
                <div
                    className={classes.contentInner}
                    ref={innerRef}
                >
                    {children}
                </div>
            </div>
            {(arrowsShown && scrollDownShown) &&
                <ScrollArrow direction="down" onClick={handleScroll(clickScrollAmount)} />
            }
        </div>
    );
};
