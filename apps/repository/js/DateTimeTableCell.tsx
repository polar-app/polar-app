import * as React from 'react';
import {isPresent} from 'polar-shared/src/Preconditions';
import Moment from 'react-moment';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';

export class DateTimeTableCell extends React.PureComponent<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        if (isPresent(this.props.datetime)) {

            return (

                <div className={this.props.className}>
                    <Moment withTitle={true}
                            titleFormat="D MMM YYYY hh:MM A"
                            filter={(value) => value.replace(/^an? /g, '1 ')}
                            fromNow ago>
                        {this.props.datetime!}
                    </Moment>
                </div>

            );

        } else {
            return null;
        }

    }

}

interface IProps {
    readonly datetime: ISODateTimeString | null | undefined;
    readonly className: string;
}
