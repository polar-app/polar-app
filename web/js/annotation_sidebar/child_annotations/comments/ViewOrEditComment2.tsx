import * as React from 'react';
import {useCallback, useState} from 'react';
import {IDocAnnotation} from '../../DocAnnotation';
import {EditButton} from "../EditButton";
import {CancelButton} from "../CancelButton";
import {Comment} from '../../../metadata/Comment';
import {useDocMetaContext} from "../../DocMetaContextProvider";
import {CommentAnnotationView2} from "./CommentAnnotationView2";
import isEqual from "react-fast-compare";
import {EditComment2} from "./EditComment2";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";


interface IProps {
    readonly comment: IDocAnnotation;
    // readonly onComment: (html: string, existingComment: Comment) => void;
}

type UsageMode = 'view' | 'edit';

export const ViewOrEditComment2 = React.memo((props: IProps) => {

    const docMetaContext = useDocMetaContext();

    const [mode, setMode] = useState<UsageMode>('view')

    const onEdit = useCallback(() => setMode('edit'), []);
    const onCancel = useCallback(() => setMode('view'), []);

    const editButton = <EditButton id={'edit-button-for-' + props.comment.id}
                                   disabled={! docMetaContext.mutable}
                                   onClick={onEdit}
                                   type="comment"/>;

    const cancelButton = <CancelButton onClick={onCancel}/>;

    const existingComment = props.comment.original as Comment;

    if (mode === 'view') {

        return <CommentAnnotationView2 comment={props.comment}
                                       onEdit={onEdit}
                                       editButton={editButton}/>;

    } else {
        return (
            // <Fade in={this.state.mode === 'edit'}>
                <EditComment2 id={'edit-comment-for' + props.comment.id}
                              existingComment={existingComment}
                              cancelButton={cancelButton}
                              // FIXME:
                              onComment={NULL_FUNCTION}
                              />
            // </Fade>
        );
    }

}, isEqual);
