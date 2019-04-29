import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {URLStr} from '../../util/Strings';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {AnnotationControlBar} from '../AnnotationControlBar';
import {ChildAnnotationSection} from '../child_annotations/ChildAnnotationSection';
import {Doc} from '../../metadata/Doc';
import {Logger} from '../../logger/Logger';

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

            return (

                // TODO/FIXME: we need the ability to scroll to the most recent
                // annotation that is created but I need a functional way to
                // do this because how do I determine when it loses focus?

                <div key={key}
                     className='p-1'>

                    <div className="area-highlight m-1"
                         data-annotation-id={annotation.id}
                         data-annotation-color={annotation.color}
                         style={{
                            display: 'block',
                            textAlign: 'center',
                            position: 'relative'

                         }}>

                        <img style={{

                                 // core CSS properties for the image so that it
                                 // is responsive.

                                 width: '100%',
                                 height: 'auto',
                                 objectFit: 'contain',
                                 maxWidth: img.width,
                                 maxHeight: img.height,

                                 // border around the image

                                 boxSizing: 'content-box',
                                 border: `1px solid #c6c6c6`,

                             }}
                             className=""
                             width={img.width}
                             height={img.height}
                             alt="screenshot"
                             src={img.src}/>

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
interface IProps {
    readonly doc: Doc;
    readonly annotation: DocAnnotation;
}

interface IState {
}

