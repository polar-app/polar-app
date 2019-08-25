import * as React from 'react';
import {BaseDocAnnotation} from "../../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {TextHighlightDocAnnotationComponent} from "./TextHighlightDocAnnotationComponent";
import {Logger} from "../../../../../../web/js/logger/Logger";
import {isPresent} from "../../../../../../web/js/Preconditions";
import {AnnotationType} from "../../../../../../web/js/metadata/AnnotationType";

const log = Logger.create();

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { docAnnotation } = this.props;

        if (! isPresent(docAnnotation.id)) {
            log.warn("No annotation id!", docAnnotation);
            return;
        }

        if (docAnnotation.id.trim() === '') {
            log.warn("Empty annotation id");
            return;
        }

        const key = 'doc-annotation-' + docAnnotation.id;

        {/*<AreaHighlightAnnotationComponent key={key}*/}
        {/*                                  annotation={annotation}*/}
        {/*                                  doc={this.props.doc}/>*/}

        if (docAnnotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {

            return (
                <div/>
            );

        } else if (docAnnotation.annotationType === AnnotationType.TEXT_HIGHLIGHT) {

            return (
                <TextHighlightDocAnnotationComponent key={key}
                                                     docAnnotation={docAnnotation}/>
            );

        } else {
            return <div/>;
        }


    }

}
interface IProps {
    readonly docAnnotation: BaseDocAnnotation;
}

interface IState {

}

