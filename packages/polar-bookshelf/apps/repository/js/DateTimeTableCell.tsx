import * as React from 'react';
import {isPresent} from 'polar-shared/src/Preconditions';
import Moment from 'react-moment';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';

interface IProps {
    readonly datetime: ISODateTimeString | null | undefined;
    readonly className?: string;
}

export const DateTimeTableCell = React.memo((props: IProps) => {

    if (isPresent(props.datetime)) {

        return (

            <Moment withTitle={true}
                    className={props.className || ''}
                    style={{
                        whiteSpace: 'nowrap',
                        userSelect: "none"
                    }}
                    titleFormat="D MMM YYYY hh:MM A"
                    // filter={(value) => value.replace(/^an? /g, '1 ')}
                    fromNow ago>
                {props.datetime!}
            </Moment>

        );

    } else {
        return null;
    }

});
