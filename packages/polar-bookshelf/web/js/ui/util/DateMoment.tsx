import * as React from 'react';
import Moment from 'react-moment';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";


/**
 * Date of the moment (month, day, year)
 */
export class DateMoment extends React.Component<IProps> {

    public render() {

        return (
            <Moment style={{}} format="LL">
                {this.props.datetime}
            </Moment>
        );

    }

}
interface IProps {
    readonly datetime: ISODateTimeString;
}
