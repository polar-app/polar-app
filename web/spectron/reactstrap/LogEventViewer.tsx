import * as React from 'react';
import {Button, InputGroupAddon} from 'reactstrap';
import {AnnotationType} from '../../js/metadata/AnnotationType';
import {CommentComponent} from '../../js/annotation_sidebar/child_annotations/CommentComponent';
import {FlashcardComponent} from '../../js/annotation_sidebar/child_annotations/FlashcardComponent';
import {LogEventComponent} from './LogEventComponent';
import {IEventDispatcher} from '../../js/reactor/SimpleReactor';
import {SyncBarProgress} from '../../js/ui/sync_bar/SyncBar';

export class LogEventViewer extends React.Component<IProps, IState> {

    private sequence: number = 0;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            rendered: []
        };

    }

    public componentDidMount(): void {

        this.props.progress.addEventListener(syncBarProgress => {

            const logEvent: LogEvent = {message: syncBarProgress.title!};

            this.state.rendered.push(<LogEventComponent key={this.sequence++} logEvent={logEvent}/>);

            this.setState(this.state);

        });
    }

    public render() {
        return this.state.rendered;
    }

}

interface IProps {
    // logEvents: LogEvent[];
    progress: IEventDispatcher<SyncBarProgress>;
}

interface IState {
    readonly rendered: any[];
}

export interface LogEvent {
    message: string;
}


