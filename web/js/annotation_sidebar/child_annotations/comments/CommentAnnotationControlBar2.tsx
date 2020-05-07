import * as React from 'react';
import {IDocAnnotation} from '../../DocAnnotation';
import {DocAuthor} from "../../DocAuthor";
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import Divider from '@material-ui/core/Divider';
import isEqual from 'react-fast-compare';
import {CommentDropdown2} from "../CommentDropdown2";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AnnotationTagButton2} from "../../AnnotationTagButton2";
import {MUIButtonBar} from "../../../../spectron0/material-ui/MUIButtonBar";
import {useAnnotationMutationsContext} from "../../AnnotationMutationsContext";

interface IProps {
    readonly comment: IDocAnnotation;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

export const CommentAnnotationControlBar2 = React.memo((props: IProps) => {

    const { comment } = props;

    const annotationMutations = useAnnotationMutationsContext();

    const handleDelete = annotationMutations.createDeletedCallback({selected: [comment]});

    return (
        <>
            <div style={{
                     display: 'flex',
                     alignItems: 'center',
                 }}
                 className="pt-1 pb-1">


                <MUIButtonBar>
                    <DocAuthor author={comment.author}/>

                    <div className="text-muted">
                        <DocAnnotationMoment created={comment.created}/>
                    </div>

                </MUIButtonBar>

                <MUIButtonBar style={{
                                 flexGrow: 1,
                                 justifyContent: 'flex-end'
                              }}>

                    <NullCollapse open={! comment.immutable}>
                        {props.editButton}
                    </NullCollapse>

                    <AnnotationTagButton2 annotation={props.comment}/>

                    <CommentDropdown2 id={'comment-dropdown-' + comment.id}
                                      disabled={comment.immutable}
                                      comment={comment}
                                      onDelete={handleDelete}/>

                </MUIButtonBar>

            </div>
            <Divider/>
        </>

    );

}, isEqual);



