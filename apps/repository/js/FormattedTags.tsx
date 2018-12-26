import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {isPresent} from '../../../web/js/Preconditions';
import Moment from 'react-moment';
import {ISODateTimeString} from '../../../web/js/metadata/ISODateTimeStrings';
import {Tag} from '../../../web/js/tags/Tag';

const log = Logger.create();

export class FormattedTags extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const tags = this.props.tags;

        const formatted = Object.values(tags)
            .map(tag => tag.label)
            .sort()
            .join(", ");

        return (
            <div>{formatted}</div>
        );

    }

}

interface IProps {
    tags: {[id: string]: Tag};
}
