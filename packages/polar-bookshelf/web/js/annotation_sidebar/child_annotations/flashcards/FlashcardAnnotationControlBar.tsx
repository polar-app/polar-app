import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {FlashcardViewDropdown} from './FlashcardViewDropdown';
import {Doc} from '../../../metadata/Doc';
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {DocAuthor} from "../../DocAuthor";
import {Tag} from 'polar-shared/src/tags/Tags';
import isEqual from "react-fast-compare";
import Divider from "@material-ui/core/Divider";
import {AnnotationTagInputButton} from "../AnnotationTagInputButton";
import {MUIButtonBar} from "../../../mui/MUIButtonBar";

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

            <div style={{
                     display: 'flex',
                     flexGrow: 1}}
                 className="pt-1 pb-1">

                <MUIButtonBar>

                    <DocAuthor author={flashcard.author}/>
                    <DocAnnotationMoment created={flashcard.created}/>

                </MUIButtonBar>

                <MUIButtonBar style={{
                                  justifyContent: 'flex-end',
                                  flexGrow: 1
                              }}>

                    {/*// FIXME need a new button that works on all components*/}
                    <AnnotationTagInputButton tagsProvider={props.tagsProvider}
                                              annotation={props.flashcard}/>

                    {props.editButton}

                    {/*<FlashcardViewDropdown id={'flashcard-dropdown-' + flashcard.id}*/}
                    {/*                       disabled={! props.doc.mutable}*/}
                    {/*                       flashcard={flashcard}*/}
                    {/*                       onDelete={() => handleDelete()}/>*/}
                </MUIButtonBar>

            </div>

            <Divider/>

        </>

    );
}, isEqual);


