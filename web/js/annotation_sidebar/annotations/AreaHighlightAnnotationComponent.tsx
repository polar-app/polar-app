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

            // FIXME: I need to figure out how to resolve the promise to the URL
            // here and whether we shouldn't remove the async framework as getFile
            // no longer needs to be async.

            return (

                <div key={key}
                     className='area-highlight p-1'>

                    <div style={{display: 'flex'}}>
                        <img style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: this.state.image.width,
                                height: this.state.image.height,
                             }}
                             alt="screenshot"
                             className="ml-auto mr-auto"
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
