import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {AnnotationControlBar} from '../AnnotationControlBar';
import {ChildAnnotationSection} from '../child_annotations/ChildAnnotationSection';
import {Doc} from '../../metadata/Doc';
import {ResponsiveImg} from '../ResponsiveImg';
import {HighlightColors} from 'polar-shared/src/metadata/HighlightColor';
import {Tag} from "polar-shared/src/tags/Tags";
import isEqual from "react-fast-compare";

const Image = (props: IProps) => {

    const {annotation} = props;
    const {img} = annotation;

    if (img) {

        return (
            <ResponsiveImg id={annotation.id} img={annotation.img} color={annotation.color}/>
        );
    } else {
        return (
            <div>No image</div>
        );
    }

};


interface IProps {
    readonly doc: Doc;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly annotation: DocAnnotation;
}
export const AreaHighlightAnnotationView = React.memo((props: IProps) => {

    const {annotation} = props;

    const key = 'area-highlight' + annotation.id;
    const borderColor = HighlightColors.toBackgroundColor(annotation.color, 0.7);

    return (

        // TODO: we need the ability to scroll to the most recent
        // annotation that is created but I need a functional way to do
        // this because how do I determine when it loses focus?

        <div key={key}
             className="p-1">

            <div className="muted-color-root">

                <div style={{
                         borderLeft: `5px solid ${borderColor}`
                     }}>

                    <Image {...props}/>

                </div>

                <AnnotationControlBar doc={props.doc}
                                      tagsProvider={props.tagsProvider}
                                      annotation={annotation}/>

            </div>

            <div className="comments">
                <ChildAnnotationSection doc={props.doc}
                                        tagsProvider={props.tagsProvider}
                                        parent={annotation}
                                        docAnnotations={annotation.getChildren()}/>
            </div>

        </div>
    );

}, isEqual);
