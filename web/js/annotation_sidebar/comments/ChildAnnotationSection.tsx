import * as React from 'react';
import {CommentComponent} from './CommentComponent';
import {DocAnnotation} from '../DocAnnotation';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ChildAnnotationSection extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { children } = this.props;

        const result: any = [];

        children.map(child => {
            result.push (<CommentComponent key={child.id} comment={child}/>);
        });

        return result;

    }

}
interface IProps {
    children: DocAnnotation[];
}

interface IState {

}

