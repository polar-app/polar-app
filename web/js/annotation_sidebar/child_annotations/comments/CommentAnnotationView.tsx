import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {CommentDropdown} from '../CommentDropdown';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Doc} from '../../../metadata/Doc';
import {DocAuthor} from "../../DocAuthor";
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import {AnnotationTagInputButton} from '../AnnotationTagInputButton';
import {Tag} from 'polar-shared/src/tags/Tags';

const log = Logger.create();

interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly doc: Doc;
    readonly comment: DocAnnotation;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

export const CommentAnnotationView = (props: IProps) => {

    const { comment } = props;

    const handleDelete = () => {
        log.info("Comment deleted: ", comment);
        delete comment.pageMeta.comments[comment.id];
    }

    const key = 'comment-' + comment.id;

    return (

        <div className="ml-1">

            <div key={key} className="comment muted-color-root">

                <div className="p-1" onDoubleClick={() => props.onEdit()}>

                    {/*TODO: based on the state determine if we should be*/}
                    {/*editing or just displaying the comment*/}

                    <span dangerouslySetInnerHTML={{__html: comment.html!}}>

                    </span>

                </div>

                <div style={{
                         display: 'flex',
                         alignItems: 'center',
                     }}
                     className="p-1">

                    <DocAuthor author={comment.author}/>

                    <div className="text-muted">
                        <DocAnnotationMoment created={comment.created}/>
                    </div>

                    <div style={{
                             flexGrow: 1,
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'flex-end'
                         }}>

                        <AnnotationTagInputButton tagsProvider={props.tagsProvider}
                                                  annotation={props.comment}/>

                        <NullCollapse open={! comment.immutable}>
                            {props.editButton}
                        </NullCollapse>

                        <CommentDropdown id={'comment-dropdown-' + comment.id}
                                         disabled={comment.immutable}
                                         comment={comment}
                                         onDelete={() => handleDelete()}/>

                    </div>

                </div>

            </div>

        </div>
    );

}



