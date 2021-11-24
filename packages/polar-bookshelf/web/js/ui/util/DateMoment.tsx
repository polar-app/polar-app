import * as React from 'react';
import Moment from 'react-moment';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

interface IProps {
    readonly datetime: ISODateTimeString;
}

/**
 * Date of the moment (month, day, year)
 */
export const DateMoment = React.memo(function DateMoment(props: IProps) {

    return (
        <Moment format="LL">
            {props.datetime}
        </Moment>
    );

});
