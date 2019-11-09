import * as React from 'react';
import {ActiveSelection} from '../popup/ActiveSelections';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {AnnotationHighlightButton} from "./AnnotationHighlightButton";
import {IStyleMap} from "../../react/IStyleMap";

const Styles: IStyleMap = {

    bar: {
        backgroundColor: '#333333',
        width: '200px'
    }

};

/**
 * An annotation bar that is placed exactly.
 */
export class ControlledAnnotationBar extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.dispatchOnHighlighted = this.dispatchOnHighlighted.bind(this);

        this.state = {};

    }

    public render() {
        return (
            <div>

                <div className="rounded p-1 annotationbar text-center" style={Styles.bar}>

                    <AnnotationHighlightButton dispatchColor='yellow'
                                               styleColor='rgba(255,255,0)'
                                               onHighlightedColor={color => this.dispatchOnHighlighted(color)}/>

                    <AnnotationHighlightButton dispatchColor='red'
                                               styleColor='rgba(255,0,0)'
                                               onHighlightedColor={color => this.dispatchOnHighlighted(color)}/>

                    <AnnotationHighlightButton dispatchColor='green'
                                               styleColor='rgba(0,255,0)'
                                               onHighlightedColor={color => this.dispatchOnHighlighted(color)}/>

                    <AnnotationHighlightButton dispatchColor='#9900EF'
                                               styleColor='#9900EF'
                                               onHighlightedColor={color => this.dispatchOnHighlighted(color)}/>

                    <AnnotationHighlightButton dispatchColor='#FF6900'
                                               styleColor='#FF6900'
                                               onHighlightedColor={color => this.dispatchOnHighlighted(color)}/>

                </div>

            </div>
        );

    }

    private dispatchOnHighlighted(highlightColor: HighlightColor) {

        const highlightCreatedEvent: HighlightCreatedEvent = {
            activeSelection: this.props.activeSelection,
            highlightColor,
            pageNum: this.props.pageNum,
            annotationDescriptor: this.props.annotationDescriptor
        };

        this.props.onHighlighted(highlightCreatedEvent);

    }

}

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

export interface IState {
}

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
