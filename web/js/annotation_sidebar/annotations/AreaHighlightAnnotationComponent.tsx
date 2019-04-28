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

    public componentDidMount(): void {

        this.computeImageURL()
            .then(imageURL => {
                this.setState({image: imageURL});
            })
            .catch(err => log.error("Could not compute image URL: ", err));

    }

    private async computeImageURL(): Promise<ImageURL | undefined> {

        const {annotation} = this.props;
        const {image} = annotation;

        if (! image) {
            return undefined;
        }

        const persistenceLayer = this.props.persistenceLayerProvider();
        const docFileMeta = await persistenceLayer.getFile(image.src.backend, image.src);

        if (docFileMeta.isPresent()) {

            const imageFileMeta = docFileMeta.get();

            const imageURL: ImageURL = {
                width: image.width!,
                height: image.height!,
                src: imageFileMeta.url
            };

            return imageURL;

        }

        return undefined;

    }

    public render() {

        const { annotation } = this.props;

        const key = 'area-highlight' + annotation.id;

        if (this.state.image) {

            return (

                // FIXME needs a ScrollIntoView wrapper... but of all the elements
                // WHICH one should be scrolled into view?  I think this is the
                // main problem.

                // seems llike the entire sidebar is being redrawn!

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
                                 maxWidth: this.state.image.width,
                                 maxHeight: this.state.image.height,

                                 // border around the image

                                 boxSizing: 'content-box',
                                 border: `1px solid #c6c6c6`,

                             }}
                             className=""
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
