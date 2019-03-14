import * as React from 'react';
import {AnnotationType} from '../../js/metadata/AnnotationType';
import {ViewComment} from '../../js/annotation_sidebar/child_annotations/comments/ViewComment';
import {DocAnnotation} from '../../js/annotation_sidebar/DocAnnotation';
import {Proxies} from '../../js/proxies/Proxies';
import {MockDocMetas} from '../../js/metadata/DocMetas';

export class CommentComponentExample extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const docMeta = Proxies.create(MockDocMetas.createWithinInitialPagemarks('0x001', 4));

        const comment: DocAnnotation = {

            id: '01010101',
            annotationType: AnnotationType.COMMENT,
            html: 'This is <b>the</b> comment.',
            pageNum: 1,
            position: {x: 0, y: 0 },
            created: "2018-10-23T21:06:22+00:00",
            comments: [],
            // the reference to a parent annotation if this is a child
            // annotation.
            children: [],
            pageMeta: docMeta.pageMetas[1]
        };

        return (

            <div>

                <ViewComment comment={comment}/>

            </div>

        );
    }

}


interface IProps {
}

interface IState {
}


