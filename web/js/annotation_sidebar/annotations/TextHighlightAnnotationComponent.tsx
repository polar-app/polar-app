import * as React from 'react';
import {AnnotationTypes} from '../../metadata/AnnotationTypes';
import {DocAnnotation} from '../DocAnnotation';
import {Optional} from '../../util/ts/Optional';
import {AnnotationControlBar} from '../AnnotationControlBar';
import {ChildAnnotationSection} from '../child_annotations/ChildAnnotationSection';
import {Doc} from '../../metadata/Doc';
import {LazyProps} from '../../react/LazyComponents';
import {LazyState} from '../../react/LazyComponents';
import {HighlightColors} from '../../metadata/HighlightColor';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class TextHighlightAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { annotation } = this.props;

        const attrType = AnnotationTypes.toDataAttribute(annotation.annotationType);

        const html = Optional.first(annotation.html).getOrElse('');

        const key = 'text-highlight-' + annotation.id;

        const borderColor = HighlightColors.toBackgroundColor(annotation.color, 0.7);

        return (

            <div className="m-0 mb-2">

                <div key={key}
                     data-annotation-id={annotation.id}
                     data-annotation-type={attrType}
                     data-annotation-color={annotation.color}
                     className={attrType}>

                    <blockquote className="p-1"
                                style={{
                                    borderLeft: `5px solid ${borderColor}`
                                }}>

                        <span className="text-sm"
                              dangerouslySetInnerHTML={{__html: html}}>

                        </span>

                    </blockquote>

                    <AnnotationControlBar doc={this.props.doc}
                                          annotation={annotation}/>

                    <div className="comments">
                        <ChildAnnotationSection doc={this.props.doc}
                                                parent={annotation}
                                                children={annotation.children}/>
                    </div>

                </div>

            </div>
        );
    }

}
interface IProps extends LazyProps {

    readonly doc: Doc;

    readonly annotation: DocAnnotation;

}

interface IState extends LazyState {

}

