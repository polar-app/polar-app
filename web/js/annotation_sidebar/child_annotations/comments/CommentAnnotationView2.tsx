import * as React from 'react';
import {IDocAnnotation} from '../../DocAnnotation';
import {CommentAnnotationControlBar2} from './CommentAnnotationControlBar2';

interface IProps {
    readonly comment: IDocAnnotation;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

export const CommentAnnotationView2 = (props: IProps) => {

    const { comment } = props;

    return (
        <div className="comment muted-color-root">

            <div className="p-1" onDoubleClick={() => props.onEdit()}>

                {/*TODO: based on the state determine if we should be*/}
                {/*editing or just displaying the comment*/}

                <span dangerouslySetInnerHTML={{__html: comment.html!}}>

                </span>

            </div>

            <CommentAnnotationControlBar2 {...props}/>

        </div>
    );

}



