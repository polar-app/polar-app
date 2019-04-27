import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {URLStr} from '../../util/Strings';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';

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
                     style={{display: 'flex'}}
                     className='area-highlight p-1'>

                    <img style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: this.state.image.width,
                            height: this.state.image.height,
                         }}
                         className="ml-auto mr-auto"
                         src={this.state.image.src}/>

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
