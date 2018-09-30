import * as React from 'react';
import {Button} from 'reactstrap';
import {ActiveSelectionEvent} from '../../js/ui/popup/ActiveSelections';
import {IEventDispatcher} from '../../js/reactor/SimpleReactor';
import {TriggerPopupEvent} from '../../js/ui/popup/TriggerPopupEvent';

export class AnnotationBar extends React.Component<AnnotationBarProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {};

        this.props.activeSelectionEventDispatcher.addEventListener(activeSelectionEvent => {
            this.setState({activeSelectionEvent});
        });


    }

    public render() {
        return (
            <div>

                <div className="rounded p-1 annotatebar text-center" style={{}}>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn"
                            title=""
                            aria-label=""
                            style={{ }}>

                        <span className="fas fa-highlighter"
                              aria-hidden="true"
                              style={{ color: 'rgba(255,255,0)' }}/>

                    </Button>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn"
                            title=""
                            aria-label=""
                            style={{ }}>

                        <span className="fas fa-highlighter annotatebar-btn-highlighter"
                              aria-hidden="true"
                              style={{color: 'rgba(255,0,0)'}}/>

                    </Button>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn annotatebar-btn-highlighter"
                            title=""
                            aria-label=""
                            style={{ }}>

                        <span className="fas fa-highlighter"
                              aria-hidden="true"
                              style={{color: 'rgba(0,255,0)'}}/>

                    </Button>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn"
                            title=""
                            aria-label=""
                            onClick={() => this.props.onComment(this.state.activeSelectionEvent!)}
                            style={{ }}>

                        <span className="fas fa-comment"
                              aria-hidden="true"
                              style={{color: 'rgba(255,255,255)'}}/>

                    </Button>

                </div>

            </div>
        );
    }

}

export interface IState {
    activeSelectionEvent?: ActiveSelectionEvent;
}

export interface AnnotationBarCallbacks {
    // called when the comment button is clicked.
    onComment: (activeSelection: ActiveSelectionEvent) => void;
}

export interface AnnotationBarProps extends AnnotationBarCallbacks {
    activeSelectionEventDispatcher: IEventDispatcher<ActiveSelectionEvent>;
}
