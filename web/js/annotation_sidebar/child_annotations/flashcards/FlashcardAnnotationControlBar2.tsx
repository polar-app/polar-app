import * as React from 'react';
import {IDocAnnotation} from '../../DocAnnotation';
import {FlashcardViewDropdown} from './FlashcardViewDropdown';
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {DocAuthor} from "../../DocAuthor";
import {AnnotationTagInputButton2} from "../AnnotationTagInputButton2";
import isEqual from "react-fast-compare";
import {MUIGridLayout} from "../../../../spectron0/material-ui/dropdown_menu/MUIGridLayout";
import Divider from "@material-ui/core/Divider";
import {useDocMetaContext} from "../../DocMetaContextProvider";

interface IProps {
    readonly flashcard: IDocAnnotation;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const FlashcardAnnotationControlBar2 = React.memo((props: IProps) => {

    const { flashcard } = props;

    const docMetaContext = useDocMetaContext();

    const handleDelete = () => {
        // FIXME: also need to flush this...
        delete flashcard.pageMeta.flashcards[flashcard.id];
    };

    return (
        <>

            <div style={{display: 'flex', flexGrow: 1}} className="pt-1 pb-1">

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
                                   <AnnotationTagInputButton2 key="tags"
                                                              annotation={props.flashcard}/>,

                                   <React.Fragment key="edit-button">
                                       {props.editButton}
                                   </React.Fragment>,

                                   <FlashcardViewDropdown key="dropdown"
                                                          id={'flashcard-dropdown-' + flashcard.id}
                                                          disabled={! docMetaContext.mutable}
                                                          flashcard={flashcard}
                                                          onDelete={() => handleDelete()}/>

                               ]}/>


            </div>

            <Divider/>

        </>

    );
}, isEqual);


