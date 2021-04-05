import React from "react";
import ExpandMore from '@material-ui/icons/ExpandMore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import {debounce} from 'throttle-debounce';
import {Theme} from "@material-ui/core";


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
                background: `linear-gradient(to ${gradDirection}, ${theme.palette.background.default} 20%, rgba(255, 255, 255, 0) 100%)`,
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

const useDVSStyles = makeStyles(() => createStyles({
    outer: {
        overflow: 'hidden',
        position: 'relative',
        maxHeight: '100%',
    },
    inner: {
        whitespace: 'nowrap',
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
    scrollMultiplier ?: number;
    clickScrollAmount ?: number;
    style ?: React.CSSProperties;
    className ?: string;
};

export const VerticalDynamicScroller: React.FC<VerticalDynamicScrollerProps> = (props) => {
    const {
        children,
        scrollMultiplier = 0.5,
        clickScrollAmount = 45,
        style = {},
        className = '',
    } = props;
    const classes = useDVSStyles();

    const innerRef = React.useRef<HTMLDivElement>(document.createElement('div'));
    const parentRef = React.useRef<HTMLDivElement>(document.createElement('div'));

    const [scrollTop, setScrollTop] = React.useState(0);
    const [innerHeight, setInnerHeight] = React.useState(0);
    const [parentHeight, setParentHeight] = React.useState(999999);

    const handleScroll = React.useCallback((newScroll: number): React.MouseEventHandler<HTMLDivElement> => {
        return () => setScrollTop(scroll => getNewScroll(parentHeight, innerHeight, scroll + newScroll));
    }, [setScrollTop, innerHeight, parentHeight]);

    React.useEffect(() => {
        const parentElem = parentRef.current;
        const wheel = (e: WheelEvent) => {
            setScrollTop((scroll) => getNewScroll(parentHeight, innerHeight, scroll + e.deltaY * scrollMultiplier));
        };
        parentElem.addEventListener('wheel', wheel);
        return () => parentElem.removeEventListener('wheel', wheel);
    }, [setScrollTop, parentHeight, innerHeight, scrollMultiplier]);

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
            setScrollTop(scroll => getNewScroll(parentHeight, innerHeight, scroll));
        }));
        resizeObserver.observe(parentElem);
        resizeObserver.observe(innerElem);

        return () => resizeObserver.disconnect();
    }, [setInnerHeight, setParentHeight]);

    const arrowsShown = parentHeight < innerHeight && parentHeight > 100;

    return  (
        <div ref={parentRef} style={style} className={`${classes.outer} ${className}`}>
            { (arrowsShown && scrollTop > 0) &&
                <ScrollArrow direction="up" onClick={handleScroll(-clickScrollAmount)} />
            }
            <div
                className={classes.inner}
                style={{ transform: `translateY(${-scrollTop}px)`}}
                ref={innerRef}
            >
                {children}
            </div>
            { (arrowsShown && scrollTop < innerHeight - parentHeight) &&
                <ScrollArrow direction="down" onClick={handleScroll(clickScrollAmount)} />
            }
        </div>
    );
};
