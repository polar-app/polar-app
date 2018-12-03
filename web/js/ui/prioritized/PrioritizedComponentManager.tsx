import * as React from 'react';
import {Button} from 'reactstrap';
import {ActiveSelection} from '../popup/ActiveSelections';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {HighlightColor} from '../../metadata/BaseHighlight';
import {PopupStateEvent} from '../popup/PopupStateEvent';
import {Listener} from '../../reactor/Listener';
import {Numbers} from '../../util/Numbers';

export class PrioritizedComponentManager extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        const sorted =
            [...this.props.prioritizedComponentRefs]
                .filter(current => current.priority() !== undefined)
                .sort((o1, o2) => Numbers.compare(o1.priority(), o2.priority()) * -1);

        if (sorted.length === 0) {
            return (<div></div>);
        }

        // return the top ranking element.
        return sorted[0].create();

    }

}

/**
 * Allows us to give a set or components to the
 */
export interface PrioritizedComponent {

    /**
     * Allows the component to determine its priority.  This could be used
     * to see if it needs to popup now or just some sort of static priority.
     *
     * Return undefined if the component should not be displayed.  This can be
     * used if the user has already performed a given action.
     */
    priority(): number | undefined;

}

export interface PrioritizedComponentRef {

    /**
     * Allows the component to determine its priority.  This could be used
     * to see if it needs to popup now or just some sort of static priority.
     *
     * Return undefined if the component should not be displayed.  This can be
     * used if the user has already performed a given action.
     */
    priority(): number | undefined;

    /**
     * Create the component when we're ready for it.
     */
    create(): JSX.Element;

}

export interface IProps {

    prioritizedComponentRefs: ReadonlyArray<PrioritizedComponentRef>;

}


export interface IState {

}

