import * as React from 'react';
import {
    ICommentCreate,
    useAnnotationMutationsContext
} from "../../AnnotationMutationsContext";
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";
import {EditComment2} from './EditComment2';
import {IDocAnnotationRef} from "../../DocAnnotation";
import {Refs} from 'polar-shared/src/metadata/Refs';
import {deepMemo} from "../../../react/ReactUtils";

interface IProps {
    readonly parent: IDocAnnotationRef;
}

export const CreateComment2 = deepMemo((props: IProps) => {

    const {parent} = props;

    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutations = useAnnotationMutationsContext();

    const commentCallback = annotationMutations.createCommentCallback(parent);

    const handleComment = React.useCallback((body: string) => {

        annotationInputContext.reset();

        const mutation: ICommentCreate = {
            type: 'create',
            body,
            parent: Refs.createRef(props.parent),
        };

        commentCallback(mutation);

    }, [annotationInputContext, commentCallback, props]);

    if (annotationInputContext.active !== 'comment') {
        return null;
    }

    return (
        <EditComment2 onCancel={() => annotationInputContext.setActive('none')}
                      onComment={handleComment}/>
    );

});
