import * as React from 'react';
import {IDocAnnotation} from "../DocAnnotation";

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationTagInputButton2 = (props: IProps) => {

    const {annotation} = props;
    const {docMeta} = annotation;

    const handleClick = () => {
        // noop
    };

    return (

        <div>TAG</div>

        // <MUIDialogController>
        //     {(dialogs) => (
        //
        //         <>
        //
        //
        //
        //         {/*<TagInputControl className='ml-1 p-1 text-muted'*/}
        //         {/*         container="body"*/}
        //         {/*         availableTags={props.tagsProvider()}*/}
        //         {/*         existingTags={() => annotation.tags ? Object.values(annotation.tags) : []}*/}
        //         {/*         onChange={(tags) => onTagged(tags)}/>*/}
        //
        //         </>
        //     )}
        // </MUIDialogController>


    );

};


