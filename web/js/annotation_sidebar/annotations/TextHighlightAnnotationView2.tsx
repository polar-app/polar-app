import * as React from 'react';
import {AnnotationTypes} from '../../metadata/AnnotationTypes';
import {IDocAnnotation} from '../DocAnnotation';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {HighlightColors} from 'polar-shared/src/metadata/HighlightColor';
import {ChildAnnotationSection2} from "../child_annotations/ChildAnnotationSection2";
import isEqual from "react-fast-compare";
import {AnnotationViewControlBar2} from "../AnnotationViewControlBar2";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";


interface IProps {
    readonly annotation: IDocAnnotation;
}

export const TextHighlightAnnotationView2 = React.memo((props: IProps) => {

    const { annotation } = props;

    const attrType = AnnotationTypes.toDataAttribute(annotation.annotationType);

    const original = annotation.original as ITextHighlight;

    const html = Optional.first(annotation.html).getOrElse('');

    const key = 'text-highlight-' + annotation.id;

    const borderColor = HighlightColors.toBackgroundColor(annotation.color, 0.7);

    return (

        <div className="m-0">

            <div key={key}
                 data-annotation-id={annotation.id}
                 data-annotation-type={attrType}
                 data-annotation-color={annotation.color}
                 className={attrType}>

                {/*NOTE: this HTML layout is specifically designed to prevent */}
                {/*excess HTML element copying when the user double clicks the */}
                {/*text.  Placing the elements in the div layout below (with */}
                {/*trailing empty div in a flexbox parent) prevents the form */}
                {/*boxes that follow from being selected.*/}

                <div style={{display: 'flex', flexDirection: 'column'}}>

                    <div className="muted-color-root">
                        <div style={{display: 'flex'}}>

                            <div className="p-1"
                                        style={{
                                            borderLeft: `5px solid ${borderColor}`
                                        }}>

                            </div>

                            <div className="text-sm"
                                  dangerouslySetInnerHTML={{__html: html}}>

                            </div>

                            <div/>

                        </div>

                        <div>
                            <AnnotationViewControlBar2 annotation={annotation}/>

                        </div>
                    </div>

                    <div>

                        <div className="comments">
                            <ChildAnnotationSection2 parent={annotation}
                                                     docAnnotations={annotation.children()}/>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}, isEqual);
