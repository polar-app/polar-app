import * as React from 'react';
import {DocRepoTableColumns} from '../doc_repo/DocRepoTableColumns';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {RepoAnnotation} from '../RepoAnnotation';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {Logger} from 'polar-shared/src/logger/Logger';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import {Either} from '../../../../web/js/util/Either';
import {BackendFileRefs} from '../../../../web/js/datastore/BackendFileRefs';
import {Img} from '../../../../web/js/metadata/Img';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DocPropTable} from "./meta_view/DocPropTable";
import {DocThumbnail} from "./meta_view/DocThumbnail";

const log = Logger.create();

const Styles: IStyleMap = {

    annotationText: {
        paddingTop: '5px'
    },

};

interface AnnotationImageProps {
    readonly id: string;
    readonly img?: Img;
}

const AnnotationImage = (props: AnnotationImageProps) => {
    return <ResponsiveImg id={props.id} img={props.img} defaultText=" "/>;
};

export class RepoAnnotationMetaView extends React.Component<IProps, IState> {

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.synchronizingDocLoader = new SynchronizingDocLoader(this.props.persistenceLayerManager);

        this.state = {
            data: [],
            columns: new DocRepoTableColumns()
        };

    }

    public render() {

        if (this.props.repoAnnotation) {

            const repoAnnotation = this.props.repoAnnotation;

            return (

                <div>

                    <div style={{display: 'flex'}}>

                        <div style={{flexGrow: 1, verticalAlign: 'top'}}>

                            <DocPropTable repoAnnotation={repoAnnotation}
                                          onDocumentLoadRequested={docInfo => this.onDocumentLoadRequested(docInfo)}/>

                        </div>

                        <div>
                            <DocThumbnail thumbnails={repoAnnotation.docInfo.thumbnails}
                                          persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}/>
                        </div>

                    </div>



                    <div style={Styles.annotationText}>
                        {repoAnnotation.text}
                    </div>

                    <AnnotationImage id={repoAnnotation.id} img={repoAnnotation.img}/>

                </div>

            );

        } else {

            return (

                <div className="text-muted text-center">
                    No annotation selected.
                </div>

            );

        }

    }

    private onDocumentLoadRequested(docInfo: IDocInfo) {

        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        this.synchronizingDocLoader.load(docInfo.fingerprint, backendFileRef!)
            .catch(err => log.error("Unable to load doc: ", err));

    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoAnnotation?: RepoAnnotation;
}

export interface IState {

}

