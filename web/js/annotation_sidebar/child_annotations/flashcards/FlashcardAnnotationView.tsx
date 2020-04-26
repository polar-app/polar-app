import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../react/IStyleMap';
import {Doc} from '../../../metadata/Doc';
import {Tag} from 'polar-shared/src/tags/Tags';
import isEqual from "react-fast-compare";
import {FlashcardAnnotationControlBar} from "./FlashcardAnnotationControlBar";

const log = Logger.create();

const Styles: IStyleMap = {

    barBody: {
        display: 'flex'
    },

    barChild: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }

};


const RenderFrontAndBackFields = (props: IProps) => {

    const { flashcard } = props;

    return (
        <div>

            <div className="pb-2 pt-2">

                    <span dangerouslySetInnerHTML={{__html: flashcard.fields!.front}}>

                    </span>

            </div>

            <div className="pb-2 pt-2 border-top">

                    <span dangerouslySetInnerHTML={{__html: flashcard.fields!.back}}>

                    </span>

            </div>

        </div>
    );

};


const RenderClozeFields = (props: IProps) => {

    const { flashcard } = props;

    return (
        <div>
            <div className="pb-2 pt-2">
                    <span dangerouslySetInnerHTML={{__html: flashcard.fields!.text}}>
                    </span>
            </div>
        </div>
    );

};

const RenderFields = (props: IProps) => {

    const { flashcard } = props;

    if (flashcard.fields!.text) {
        return (<RenderClozeFields {...props}/>);
    } else {
        return (<RenderFrontAndBackFields {...props}/>);
    }

};


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
export const FlashcardAnnotationView = React.memo((props: IProps) => {

    const { flashcard } = props;

    const key = 'comment-' + flashcard.id;

    return (

        <div key={key} className="mt-1 ml-2">

            <div className="">

                <div onDoubleClick={props.onEdit}>

                    <RenderFields {...props}/>

                </div>

            </div>

            <FlashcardAnnotationControlBar tagsProvider={props.tagsProvider}
                                           flashcard={flashcard}
                                           doc={props.doc}
                                           editButton={props.editButton}
                                           onEdit={props.onEdit}/>

        </div>
    );
}, isEqual);


