import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {URLStr} from '../../util/Strings';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {AnnotationControlBar} from '../AnnotationControlBar';
import {ChildAnnotationSection} from '../child_annotations/ChildAnnotationSection';
import {Doc} from '../../metadata/Doc';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class AreaHighlightAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public componentDidMount(): void {

        const {annotation} = this.props;
        const {image} = annotation;

        // FIXME: we're performing an update on an unmounted component here.

        // FIXME the image ratio isn't being preserved here...

        // we need to see how to do this properly.

        if (image) {
            // FIXME: this should be its own function...
            const persistenceLayer = this.props.persistenceLayerProvider();
            persistenceLayer.getFile(image.src.backend, image.src)
                .then(docFileMeta => {

                    docFileMeta.map(imageFile => {

                        const imageURL: ImageURL = {
                            width: image.width!,
                            height: image.height!,
                            src: imageFile.url
                        };

                        this.setState({image: imageURL});

                    });

                });

        }

    }

    public render() {

        const { annotation } = this.props;

        const key = 'area-highlight' + annotation.id;

        if (this.state.image) {

            return (

                <div key={key}
                     className='area-highlight p-1'>

                    <div className="m-1"
                         style={{
                            display: 'block',
                            textAlign: 'center',
                            position: 'relative'

                         }}>

                        {/*FIXME what else to test... */}
                        {/*// a div inside the parent..*/}


                        <img style={{
                                 width: '100%',
                                 height: 'auto',
                                 objectFit: 'contain',
                                 maxWidth: this.state.image.width,
                                 maxHeight: this.state.image.height,

                                 boxSizing: 'content-box',
                                 border: `1px solid #c6c6c6`

                             }}
                             width={this.state.image.width}
                             height={this.state.image.height}
                             alt="screenshot"
                             src={this.state.image.src}/>

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
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
    readonly image?: ImageURL;
}

export interface ImageURL {
    readonly width: number;
    readonly height: number;
    readonly src: URLStr;
}
