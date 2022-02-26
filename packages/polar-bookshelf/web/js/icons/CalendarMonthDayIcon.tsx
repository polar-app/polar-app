import React from "react";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {useTimeInterval} from "../react/useTimeInterval";

interface IProps {
    className?: string;
    style?: React.CSSProperties;
}

export const useMonthDay = () => {
    const [ms] = useTimeInterval('1d');

    return new Date(ms).getDate();
};

const useStyles = makeStyles((theme) =>
    createStyles({
        outerRoot: {
            width: '1em',
            height: '1em',
            display: 'inline-block',
            fontSize: theme.typography.pxToRem(24),
        },
        root: {
            fill: 'currentColor',
        },
        innerText: {
            fontSize: '0.8rem',
        }
    })
);

export const CalendarMonthDayIcon: React.FC<IProps> = (props) => {
    const { className, style } = props;
    const monthDay = useMonthDay();
    const classes = useStyles();

    return (
        <div className={clsx(className, classes.outerRoot)}>
            <svg className={classes.root}
                 style={style}
                 focusable="false"
                 width="100%"
                 height="100%"
                 viewBox="0 0 24 24"
                 aria-hidden="true">
                <g>
                    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
                    <text y="18" x="50%" textAnchor="middle" className={classes.innerText}>
                        {monthDay}
                    </text>
                </g>
            </svg>
        </div>
    );
};
