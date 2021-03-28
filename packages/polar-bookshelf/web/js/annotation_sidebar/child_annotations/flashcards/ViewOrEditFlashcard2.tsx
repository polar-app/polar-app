import * as React from 'react';
import {useCallback, useState} from 'react';
import {IDocAnnotationRef} from '../../DocAnnotation';
import {EditButton} from "../EditButton";
import {CancelButton} from "../CancelButton";
import {FlashcardAnnotationView2} from './FlashcardAnnotationView2';
import {Flashcard} from '../../../metadata/Flashcard';
import isEqual from 'react-fast-compare';
import {useDocMetaContext} from "../../DocMetaContextProvider";
import {FlashcardInput2} from "./flashcard_input/FlashcardInput2";

interface IProps {
    readonly flashcard: IDocAnnotationRef;
}

type UsageMode = 'view' | 'edit';

export const ViewOrEditFlashcard2 = React.memo((props: IProps) => {

    const {doc} = useDocMetaContext();

    const [mode, setMode] = useState<UsageMode>('view')

    const onEdit = useCallback(() => setMode('edit'), []);
    const onCancel = useCallback(() => setMode('view'), []);

    const editButton = <EditButton id={'edit-button-for-' + props.flashcard.id}
                                   disabled={! doc?.mutable}
                                   onClick={onEdit}
                                   type="flashcard"/>;

    const existingFlashcard = props.flashcard.original as Flashcard;

    // return (
    //     <>
    //         <Slide in={mode === 'view'} mountOnEnter unmountOnExit>
    //             <FlashcardAnnotationView2 flashcard={props.flashcard}
    //                                       onEdit={onEdit}
    //                                       editButton={editButton}/>
    //         </Slide>
    //         {/*<Slide in={mode === 'edit'} mountOnEnter unmountOnExit>*/}
    //         {/*    <FlashcardInput2 id={'edit-flashcard-for' + props.flashcard.id}*/}
    //         {/*                     flashcardType={existingFlashcard.type}*/}
    //         {/*                     existingFlashcard={existingFlashcard}*/}
    //         {/*                     cancelButton={cancelButton}/>*/}
    //         {/*</Slide>*/}
    //
    //     </>
    //
    // );
    //
    if (mode === 'view') {

        return <FlashcardAnnotationView2 flashcard={props.flashcard}
                                         onEdit={onEdit}
                                         editButton={editButton}/>;

    } else {
        return <FlashcardInput2 id={'edit-flashcard-for' + props.flashcard.id}
                                flashcard={props.flashcard}
                                flashcardType={existingFlashcard.type}
                                existingFlashcard={existingFlashcard}
                                onCancel={onCancel}/>;
    }

}, isEqual);

