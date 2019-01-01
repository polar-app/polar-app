import * as React from 'react';
import {Ref} from '../../js/metadata/Refs';
import {AnnotationType} from '../../js/metadata/AnnotationType';
import {CommentComponent} from '../../js/annotation_sidebar/child_annotations/CommentComponent';
import {DocAnnotation} from '../../js/annotation_sidebar/DocAnnotation';
import {HTMLString} from '../../js/util/HTMLString';
import {Screenshot} from '../../js/metadata/Screenshot';
import {Point} from '../../js/Point';
import {ISODateTimeString} from '../../js/metadata/ISODateTimeStrings';
import {Comment} from '../../js/metadata/Comment';
import {HighlightColor} from '../../js/metadata/BaseHighlight';
import {PageMeta} from '../../js/metadata/PageMeta';
import {Proxies} from '../../js/proxies/Proxies';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {FlashcardComponent} from '../../js/annotation_sidebar/child_annotations/FlashcardComponent';

export class FlashcardComponentExample extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const docMeta = Proxies.create(MockDocMetas.createWithinInitialPagemarks('0x001', 4));

        const fields = {
            'front': 'this is the front',
            'back': 'this is the back'
        };

        const flashcard: DocAnnotation = {

            id: '01010101',
            annotationType: AnnotationType.COMMENT,
            html: 'This is <b>the</b> comment.',
            pageNum: 1,
            position: {x: 0, y: 0},
            created: "2018-10-23T21:06:22+00:00",
            comments: [],
            // the reference to a parent annotation if this is a child annotation.
            children: [],
            pageMeta: docMeta.pageMetas[1],
            fields
        };

        return (

            <div className="m-2">

                <FlashcardComponent flashcard={flashcard} />

            </div>

        );
    }

}


interface IProps {
}

interface IState {
}


