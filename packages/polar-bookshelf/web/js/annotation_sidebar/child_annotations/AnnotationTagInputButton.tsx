import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {TagInputControl} from "../../../../apps/repository/js/TagInputControl";
import {DocAnnotation} from "../DocAnnotation";
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {DocMetas} from "../../metadata/DocMetas";

interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly annotation: DocAnnotation;
}

export const AnnotationTagInputButton = (props: IProps) => {

    const {annotation} = props;
    const {docMeta} = annotation;

    const onTagged = (tags: ReadonlyArray<Tag>) => {

        setTimeout(() => {

            const updates = {tags: Tags.toMap(tags)};

            DocMetas.withBatchedMutations(docMeta, () => {

                AnnotationMutations.update(docMeta,
                                           annotation.annotationType,
                                           {...annotation.original, ...updates});

            });


        }, 1);

    };

    return (
        <TagInputControl className='ml-1 p-1 text-muted'
                         container="body"
                         availableTags={props.tagsProvider()}
                         existingTags={() => annotation.tags ? Object.values(annotation.tags) : []}
                         onChange={(tags) => onTagged(tags)}/>
    );

};


