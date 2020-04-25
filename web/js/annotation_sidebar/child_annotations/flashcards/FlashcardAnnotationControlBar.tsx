import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {FlashcardViewDropdown} from './FlashcardViewDropdown';
import {Doc} from '../../../metadata/Doc';
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {DocAuthor} from "../../DocAuthor";
import {AnnotationTagInputButton} from "../AnnotationTagInputButton";
import {Tag} from 'polar-shared/src/tags/Tags';
import isEqual from "react-fast-compare";
import {MUIGridLayout} from "../../../../spectron0/material-ui/dropdown_menu/MUIGridLayout";
import Divider from "@material-ui/core/Divider";

interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly flashcard: DocAnnotation;
    readonly doc: Doc;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const FlashcardAnnotationControlBar = React.memo((props: IProps) => {

    const { flashcard } = props;

    const handleDelete = () => {
        // FIXME: also need to flush this...
        delete flashcard.pageMeta.flashcards[flashcard.id];
    };

    return (
        <>

            <div style={{display: 'flex', flexGrow: 1}}>

                <MUIGridLayout items={[

                    <DocAuthor key="author" author={flashcard.author}/>,
                    <DocAnnotationMoment key="moment" created={flashcard.created}/>,

                ]}/>

                <MUIGridLayout key="right-bar"
                               style={{
                                   justifyContent: 'flex-end',
                                   flexGrow: 1
                               }}
                               items={[

                                   // FIXME need a new button that works on all components
                                   <AnnotationTagInputButton key="tags"
                                                             tagsProvider={props.tagsProvider}
                                                             annotation={props.flashcard}/>,

                                   // FIXME
                                   //         {props.editButton}

                                   <FlashcardViewDropdown key="dropdown"
                                                          id={'flashcard-dropdown-' + flashcard.id}
                                                          disabled={! props.doc.mutable}
                                                          flashcard={flashcard}
                                                          onDelete={() => handleDelete()}/>

                               ]}/>


            </div>

            <Divider/>

        </>

    );
}, isEqual);


