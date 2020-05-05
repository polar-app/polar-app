import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {DocAuthor} from "../../DocAuthor";
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import {AnnotationTagInputButton2} from '../AnnotationTagInputButton2';
import Divider from '@material-ui/core/Divider';
import isEqual from 'react-fast-compare';
import {CommentDropdown2} from "../CommentDropdown2";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly comment: DocAnnotation;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

export const CommentAnnotationControlBar2 = React.memo((props: IProps) => {

    const { comment } = props;

    return (
        <>
            <div style={{
                     display: 'flex',
                     alignItems: 'center',
                 }}
                 className="pt-1 pb-1">

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

                    {/*FIXME: connect this up*/}
                    <AnnotationTagInputButton2 annotation={props.comment}/>

                    <NullCollapse open={! comment.immutable}>
                        {props.editButton}
                    </NullCollapse>

                    {/*FIXME: connect this up*/}
                    <CommentDropdown2 id={'comment-dropdown-' + comment.id}
                                      disabled={comment.immutable}
                                      comment={comment}
                                      onDelete={NULL_FUNCTION}/>

                </div>

            </div>
            <Divider/>
        </>

    );

}, isEqual);



