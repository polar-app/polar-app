import * as React from 'react';
import Moment from 'react-moment';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/core";
import isEqual from "react-fast-compare";

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
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const DocAnnotationMoment = React.memo(function DocAnnotationMoment(props: IProps) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Moment style={{
                        fontSize: '12px'
                    }}
                    withTitle={true}
                    titleFormat="D MMM YYYY hh:MM A" fromNow>
                {props.created}
            </Moment>
        </div>
    );

}, isEqual);
