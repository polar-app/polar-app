import * as React from 'react';
import {DocAnnotation} from "../DocAnnotation";

interface IProps {
    readonly annotation: DocAnnotation;
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


