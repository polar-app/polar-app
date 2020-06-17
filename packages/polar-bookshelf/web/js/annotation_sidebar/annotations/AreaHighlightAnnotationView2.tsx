import * as React from 'react';
import {IDocAnnotationRef} from '../DocAnnotation';
import {ResponsiveImg} from '../ResponsiveImg';
import {HighlightColors} from 'polar-shared/src/metadata/HighlightColor';
import isEqual from "react-fast-compare";
import {AnnotationViewControlBar2} from "../AnnotationViewControlBar2";

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
    readonly annotation: IDocAnnotationRef;
}
export const AreaHighlightAnnotationView2 = React.memo((props: IProps) => {

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

                <AnnotationViewControlBar2 annotation={annotation}/>

            </div>

        </div>
    );

}, isEqual);
