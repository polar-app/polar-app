import * as React from 'react';
import {Button} from 'reactstrap';
import {ActiveSelection} from '../../js/ui/popup/ActiveSelections';
import {IEventDispatcher} from '../../js/reactor/SimpleReactor';
import {AnnotationDescriptor} from '../../js/metadata/AnnotationDescriptor';
import {HighlightCreatedEvent} from '../../js/comments/react/HighlightCreatedEvent';
import {HighlightColor} from '../../js/metadata/BaseHighlight';

export class AnnotationBar extends React.Component<AnnotationBarProps, IState> {

    constructor(props: any) {
        super(props);

        this.dispatchOnHighlighted = this.dispatchOnHighlighted.bind(this);
        this.dispatchOnCommented = this.dispatchOnCommented.bind(this);

        this.state = {};

        this.props.annotationBarTriggerEventDispatcher.addEventListener(annotationBarTriggerEventDispatcher => {
            this.setState({annotationBarTriggerEventDispatcher});
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
                            onClick={() => this.dispatchOnHighlighted('yellow')}
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
                            onClick={() => this.dispatchOnHighlighted('red')}
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
                            onClick={() => this.dispatchOnHighlighted('green')}
                            style={{ }}>

                        <span className="fas fa-highlighter"
                              aria-hidden="true"
                              style={{color: 'rgba(0,255,0)'}}/>

                    </Button>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn annotatebar-btn-comment"
                            title=""
                            aria-label=""
                            onClick={() => this.dispatchOnCommented()}
                            style={{ }}>

                        <span className="fas fa-comment"
                              aria-hidden="true"
                              style={{color: 'rgba(255,255,255)'}}/>

                    </Button>

                </div>

            </div>
        );

    }

    private dispatchOnHighlighted(highlightColor: HighlightColor) {

        const highlightCreatedEvent: HighlightCreatedEvent = {
            activeSelection: this.state.annotationBarTriggerEventDispatcher!.activeSelection,
            highlightColor,
            pageNum: this.state.annotationBarTriggerEventDispatcher!.pageNum,
            annotationDescriptor: this.state.annotationBarTriggerEventDispatcher!.annotationDescriptor

        };

        this.props.onHighlighted(highlightCreatedEvent);

    }

    private dispatchOnCommented() {

        const commentTriggerEvent: CommentTriggerEvent = {
            ...this.state.annotationBarTriggerEventDispatcher!,
        };

        this.props.onComment(commentTriggerEvent);

    }

}

export interface IState {
    annotationBarTriggerEventDispatcher?: AnnotationBarTriggerEvent;
}

export interface AnnotationBarCallbacks {
    // called when the comment button is clicked.
    onHighlighted: OnHighlightedCallback;
    onComment: OnCommentCallback;
}

export type OnHighlightedCallback
    = (highlightCreatedEvent: HighlightCreatedEvent) => void;

export interface CommentTriggerEvent extends AnnotationBarEvent {

}

// FIXME: this should be CommentCreatedEvent
export type OnCommentCallback
    = (commentTriggerEvent: CommentTriggerEvent) => void;

export interface AnnotationBarProps extends AnnotationBarCallbacks {
    annotationBarTriggerEventDispatcher: IEventDispatcher<AnnotationBarTriggerEvent>;
}

export interface AnnotationBarEvent {

    /**
     * The ActiveSelection in the browser that's being selected by the user.
     */
    readonly activeSelection: ActiveSelection;

    readonly type: ActiveSelectionType;

    readonly pageNum: number;

    /**
     * An optional annotationDescriptor if this is an existing annotation.
     */
    readonly annotationDescriptor?: AnnotationDescriptor;

}

export interface AnnotationBarTriggerEvent extends AnnotationBarEvent {


}


/**
 * The type of the selection.  A 'range' is just a user highlight.  Otherwise
 * it's either a previously created 'text-highlight' or 'area-highlight
 */
export type ActiveSelectionType = 'range' | 'text-highlight' | 'area-highlight';
