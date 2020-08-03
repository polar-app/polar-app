import * as React from 'react';
import {ActiveSelection, ActiveSelectionType} from '../popup/ActiveSelections';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {AnnotationHighlightButton} from "./AnnotationHighlightButton";

export interface IProps extends AnnotationBarCallbacks {

    /**
     * The ActiveSelection in the browser that's being selected by the user.
     */
    readonly activeSelection: ActiveSelection;

    readonly type: AnnotationBarTargetType;

    readonly pageNum: number;

    /**
     * An optional annotationDescriptor if this is an existing annotation.
     */
    readonly annotationDescriptor?: AnnotationDescriptor;

}

export const ControlledAnnotationBar = (props: IProps) => {

    function dispatchOnHighlighted(highlightColor: HighlightColor) {

        const highlightCreatedEvent: HighlightCreatedEvent = {
            activeSelection: props.activeSelection,
            highlightColor,
            pageNum: props.pageNum,
            annotationDescriptor: props.annotationDescriptor
        };

        props.onHighlighted(highlightCreatedEvent);

    }

    return (
        <div>

            <div className="polar-ui"
                 style={{
                     backgroundColor: '#333333',
                     fontSize: '14px',
                     padding: '0',
                     paddingLeft: '10px',
                     paddingRight: '10px',
                     paddingTop: '5px',
                     paddingBottom: '5px',
                     borderRadius: '3px',
                     boxShadow: '0 0 5px #000'
                 }}>

                <AnnotationHighlightButton dispatchColor='yellow'
                                           styleColor='rgba(255,255,0)'
                                           onHighlightedColor={color => dispatchOnHighlighted(color)}/>

                <AnnotationHighlightButton dispatchColor='red'
                                           styleColor='rgba(255,0,0)'
                                           onHighlightedColor={color => dispatchOnHighlighted(color)}/>

                <AnnotationHighlightButton dispatchColor='green'
                                           styleColor='rgba(0,255,0)'
                                           onHighlightedColor={color => dispatchOnHighlighted(color)}/>

                <AnnotationHighlightButton dispatchColor='#9900EF'
                                           styleColor='#9900EF'
                                           onHighlightedColor={color => dispatchOnHighlighted(color)}/>

                <AnnotationHighlightButton dispatchColor='#FF6900'
                                           styleColor='#FF6900'
                                           onHighlightedColor={color => dispatchOnHighlighted(color)}/>

            </div>

        </div>
    );
};

export interface AnnotationBarCallbacks {
    // called when the comment button is clicked.
    onHighlighted: OnHighlightedCallback;
}

export type OnHighlightedCallback
    = (highlightCreatedEvent: HighlightCreatedEvent) => void;

/**
 * The type of the selection.  A 'range' is just a user highlight.  Otherwise
 * it's either a previously created 'text-highlight' or 'area-highlight
 */
export type AnnotationBarTargetType = 'range' | 'text-highlight' | 'area-highlight';

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

export interface CommentTriggerEvent extends AnnotationBarEvent {

}

// TODO: this should be CommentCreatedEvent
export type OnCommentCallback
    = (commentTriggerEvent: CommentTriggerEvent) => void;
