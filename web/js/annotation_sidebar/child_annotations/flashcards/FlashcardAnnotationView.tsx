import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {Doc} from '../../../metadata/Doc';
import {Tag} from 'polar-shared/src/tags/Tags';
import isEqual from "react-fast-compare";
import {FlashcardAnnotationControlBar} from "./FlashcardAnnotationControlBar";
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import Divider from "@material-ui/core/Divider";

const RenderFrontAndBackFields = (props: IProps) => {

    const { flashcard } = props;

    return (
        <Card variant="outlined">

            <CardContent>

                <div className="pb-2">

                <span dangerouslySetInnerHTML={{__html: flashcard.fields!.front}}>

                </span>

                </div>

                <Divider/>

                <div className="pt-2">

                <span dangerouslySetInnerHTML={{__html: flashcard.fields!.back}}>

                </span>

                </div>

            </CardContent>

        </Card>
    );

};


const RenderClozeFields = (props: IProps) => {

    const { flashcard } = props;

    return (
        <Card>
            <CardContent>
                <span dangerouslySetInnerHTML={{__html: flashcard.fields!.text}}>
                </span>
            </CardContent>
        </Card>
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

                <div>

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


