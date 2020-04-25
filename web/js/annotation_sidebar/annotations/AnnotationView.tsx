import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {AreaHighlightAnnotationView} from './AreaHighlightAnnotationView';
import {TextHighlightAnnotationView} from './TextHighlightAnnotationView';
import {Doc} from '../../metadata/Doc';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {Tag} from 'polar-shared/src/tags/Tags';
import Divider from "@material-ui/core/Divider";
import isEqual from "react-fast-compare";
import {MUIHoverController} from "../../mui/context/MUIHoverContext";

const log = Logger.create();

interface IProps {

    readonly tagsProvider: () => ReadonlyArray<Tag>;

    readonly persistenceLayerProvider: PersistenceLayerProvider;

    readonly annotation: DocAnnotation;

    readonly doc: Doc;

}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const AnnotationView = React.memo((props: IProps) => {

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
                <AreaHighlightAnnotationView annotation={annotation}
                                             tagsProvider={props.tagsProvider}
                                             doc={props.doc}/>
            );

        } else {

            return (
                <TextHighlightAnnotationView annotation={annotation}
                                             tagsProvider={props.tagsProvider}
                                             doc={props.doc}/>
            );

        }
    };

    const key = 'doc-annotation-' + annotation.id;

    return (
        <div key={key}>
            <MUIHoverController>
                <>
                    <AnnotationTypeComponent/>
                    <Divider/>
                </>
            </MUIHoverController>
        </div>
    );

}, isEqual);

