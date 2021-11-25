import * as React from 'react';
import {isPresent} from 'polar-shared/src/Preconditions';
import Moment from 'react-moment';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';

interface IProps {
    readonly datetime: Date | ISODateTimeString | null | undefined;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const DateTimeTableCell = React.memo(function DateTimeTableCell(props: IProps) {

    const datetime = React.useMemo(() => {

        if (props.datetime === null || props.datetime === undefined) {
            return props.datetime;
        }

        return typeof props.datetime === 'string' ? props.datetime : ISODateTimeStrings.create(props.datetime);

    }, [])

    if (isPresent(datetime)) {

        return (

            <Moment withTitle={true}
                    className={props.className || ''}
                    style={{
                        whiteSpace: 'nowrap',
                        userSelect: "none",
                        ...props.style
                    }}
                    titleFormat="D MMM YYYY hh:MM A"
                    // filter={(value) => value.replace(/^an? /g, '1 ')}
                    fromNow ago>
                {datetime!}
            </Moment>

        );

    } else {
        return null;
    }

});
