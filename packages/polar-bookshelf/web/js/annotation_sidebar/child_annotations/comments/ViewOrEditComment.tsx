import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {EditButton} from "../EditButton";
import {EditComment} from "./EditComment";
import {CommentAnnotationView} from "./CommentAnnotationView";
import {CancelButton} from "../CancelButton";
import {Comment} from '../../../metadata/Comment';
import {Doc} from '../../../metadata/Doc';
import {Tag} from "polar-shared/src/tags/Tags";
import Fade from "@material-ui/core/Fade";

export class ViewOrEditComment extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onEdit = this.onEdit.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            mode: 'view'
        };

    }

    public render() {

        const editButton = <EditButton id={'edit-button-for-' + this.props.id}
                                       disabled={! this.props.doc.mutable}
                                       onClick={() => this.onEdit()}
                                       type="comment"/>;

        const cancelButton = <CancelButton onClick={() => this.onCancel()}/>;

        const existingComment = this.props.comment.original as Comment;

        // return (
        //     <>
        //
        //     </>
        // );

        if (this.state.mode === 'view') {

            return <CommentAnnotationView comment={this.props.comment}
                                          tagsProvider={this.props.tagsProvider}
                                          doc={this.props.doc}
                                          onEdit={() => this.onEdit()}
                                          editButton={editButton}/>;

        } else {
            return (
                // <Fade in={this.state.mode === 'edit'}>
                    <EditComment id={'edit-comment-for' + this.props.id}
                                    onComment={(html) => this.props.onComment(html, existingComment)}
                                    existingComment={existingComment}
                                    cancelButton={cancelButton}/>
                // </Fade>
            );
        }

    }

    private onEdit() {
        this.setState({mode: 'edit'});
    }

    private onCancel() {
        this.setState({mode: 'view'});
    }

}
interface IProps {
    readonly id: string;
    readonly doc: Doc;
    readonly comment: DocAnnotation;
    readonly onComment: (html: string, existingComment: Comment) => void;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

interface IState {
    readonly mode: 'view' | 'edit';
}


