import * as React from 'react';
import clsx from "clsx";
import Moment from 'react-moment';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: 'auto',
            marginBottom: 'auto',
            color: theme.palette.text.secondary,
            whiteSpace: 'nowrap'
        },
    }),
);

interface IProps {
    readonly created: ISODateTimeString;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const DocAnnotationMoment = React.memo(function DocAnnotationMoment(props: IProps) {

    const classes = useStyles();
    const {created, style, className = ""} = props;

    return (
        <div style={style} className={clsx(classes.root, className)}>
            <Moment style={{ fontSize: '12px' }}
                    withTitle
                    titleFormat="D MMM YYYY hh:MM A" fromNow>
                {created}
            </Moment>
        </div>
    );

});
