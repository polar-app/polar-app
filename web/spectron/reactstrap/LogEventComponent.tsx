import * as React from 'react';
import {LogEvent} from './LogEventViewer';
import {ListGroupItem} from 'reactstrap';

export class LogEventComponent extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <ListGroupItem className="p-1">{this.props.logEvent.message}</ListGroupItem>

        );

    }

}

interface IProps {
    logEvent: LogEvent;
}
