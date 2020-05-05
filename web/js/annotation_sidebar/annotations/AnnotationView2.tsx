import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import isEqual from "react-fast-compare";
import {MUIHoverController} from "../../mui/context/MUIHoverContext";
import {AreaHighlightAnnotationView2} from "./AreaHighlightAnnotationView2";
import {TextHighlightAnnotationView2} from './TextHighlightAnnotationView2';

const log = Logger.create();

interface IProps {
    readonly annotation: DocAnnotation;
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const AnnotationView2 = React.memo((props: IProps) => {

    const { annotation } = props;

    if (! isPresent(annotation.id)) {
        log.warn("No annotation id!", annotation);
        return null;
    }

    if (annotation.id.trim() === '') {
        log.warn("Empty annotation");
        return null;
    }

    const AnnotationTypeComponent = () => {
        if (annotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {

            return (
                <AreaHighlightAnnotationView2 annotation={annotation}/>
            );

        } else {

            return (
                <TextHighlightAnnotationView2 annotation={annotation}/>
            );

        }
    };

    const key = 'doc-annotation-' + annotation.id;

    return (
        <div key={key} className="mt-1">
            <MUIHoverController>
                <>
                    <AnnotationTypeComponent/>
                </>
            </MUIHoverController>
        </div>
    );

}, isEqual);

