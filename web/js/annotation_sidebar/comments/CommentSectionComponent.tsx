import * as React from 'react';
import {CommentComponent} from './CommentComponent';
import {Comment} from '../../metadata/Comment';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class CommentSectionComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { comments } = this.props;

        const result: any = [];

        comments.map(comment => {
            result.push (<CommentComponent key={comment.id} comment={comment}/>);
        });

        return result;

    }

}
interface IProps {
    comments: Comment[];
}

interface IState {

}

