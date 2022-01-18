import React from "react";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

interface IProps {
    className?: string;
    style?: React.CSSProperties;
}

export const useMonthDay = () => {
    const [day, setDay] = React.useState<number>(new Date().getDate());
    const timeoutRef = React.useRef<number | undefined>(undefined);

    const computeDurationForTimeout = React.useCallback(() => {

        const cutoff = new Date();
        cutoff.setHours(24);
        cutoff.setMinutes(0);
        cutoff.setSeconds(0);
        cutoff.setMilliseconds(0);

        const now = new Date();

        return Math.abs(cutoff.getTime() - now.getTime());

    }, []);

    const scheduleTimeout = React.useCallback(() => {

        const duration = computeDurationForTimeout()

        timeoutRef.current = window.setTimeout(() => {
            setDay(new Date().getDate());

            //now reschedule in the future.
            scheduleTimeout();

        }, duration);

    }, [computeDurationForTimeout])

    React.useEffect(() => {

        scheduleTimeout();

        return () => clearTimeout(timeoutRef.current);

    }, [setDay, day, computeDurationForTimeout, scheduleTimeout]);

    return day;

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

export const MUICalendarMonthDayIcon: React.FC<IProps> = (props) => {
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
