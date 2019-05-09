import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {AnnotationControlBar} from '../AnnotationControlBar';
import {ChildAnnotationSection} from '../child_annotations/ChildAnnotationSection';
import {Doc} from '../../metadata/Doc';
import {Logger} from '../../logger/Logger';
import {LazyProps} from '../../react/LazyComponents';
import {ResponsiveImg} from '../ResponsiveImg';
import {HighlightColors} from '../../metadata/HighlightColor';

const log = Logger.create();

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class AreaHighlightAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const {annotation} = this.props;
        const {img} = annotation;

        const key = 'area-highlight' + annotation.id;

        if (img) {

            const borderColor = HighlightColors.toBackgroundColor(annotation.color, 0.7);

            return (

                // TODO: we need the ability to scroll to the most recent
                // annotation that is created but I need a functional way to do
                // this because how do I determine when it loses focus?

                <div key={key}
                     className='p-1'>

                    <div style={{
                            borderLeft: `5px solid ${borderColor}`
                        }}>

                        <ResponsiveImg id={annotation.id} img={annotation.img} color={annotation.color}/>

                    </div>

                    <AnnotationControlBar doc={this.props.doc}
                                          annotation={annotation}/>

                    <div className="comments">
                        <ChildAnnotationSection doc={this.props.doc}
                                                parent={annotation}
                                                children={annotation.children}/>
                    </div>

                </div>
            );
        } else {
            return (
                <div key={key} className='area-highlight'>
                    no image
                </div>
            );
        }

    }

}
interface IProps extends LazyProps {
    readonly doc: Doc;
    readonly annotation: DocAnnotation;
}

interface IState extends LazyProps {
}

