import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {EditButton} from "../EditButton";
import {EditComment} from "./EditComment";
import {ViewComment} from "./ViewComment";

export class ViewOrEditComment extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            mode: 'view'
        };

    }

    public render() {

        const editButton =  <EditButton id={'edit-button-for-' + this.props.id}
                                        onClick={() => this.onEdit()}
                                        type="comment"/>

        if (this.state.mode === 'view') {

            return <ViewComment comment={this.props.comment}
                                editButton={editButton}/>;

        } else {
            return <EditComment id={'edit-comment-for' + this.props.id}/>;
        }

    }

    private onEdit() {
        this.setState({mode: 'edit'});
    }

}
interface IProps {
    id: string;
    comment: DocAnnotation;
}

interface IState {
    readonly mode: 'view' | 'edit';
}


