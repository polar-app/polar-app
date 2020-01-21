import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocAnnotations} from './DocAnnotations';
import {DocAnnotation} from './DocAnnotation';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotationComponent} from './annotations/DocAnnotationComponent';
import {ExportButton} from '../ui/export/ExportButton';
import {Exporters, ExportFormat} from '../metadata/exporter/Exporters';
import {PersistenceLayerProvider} from '../datastore/PersistenceLayer';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Doc} from '../metadata/Doc';
import {GroupSharingButton} from '../ui/group_sharing/GroupSharingButton';
import {Firebase} from "../firebase/Firebase";
import {DocMetaListeners, DocMetaRecords} from "../datastore/sharing/db/DocMetaListeners";
import {DocMetas} from "../metadata/DocMetas";
import {UserProfiles} from "../datastore/sharing/db/UserProfiles";
import {DocAnnotationIndexManager} from "./DocAnnotationIndexManager";
import {DocFileResolvers} from "../datastore/DocFileResolvers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FeatureToggle} from "../ui/FeatureToggle";
import {InputFilter} from '../ui/input_filter/InputFilter2';
import {AnnotationRepoFiltersHandler} from "../../../apps/repository/js/annotation_repo/AnnotationRepoFiltersHandler";
import {AnnotationRepoFilterEngine} from "../../../apps/repository/js/annotation_repo/AnnotationRepoFilterEngine";
import {DatastoreCapabilities} from "../datastore/Datastore";
import Button from "reactstrap/lib/Button";
import {DeviceRouter} from "../ui/DeviceRouter";
import {AppRuntimeRouter} from "../ui/AppRuntimeRouter";

const log = Logger.create();

const LoadRepositoryExplainer = () => (
    <div className="p-2 text-center">

        <h2 className="text-muted mb-3">
            Click below for your personal repository
        </h2>

        <a href="https://app.getpolarized.io">

            <img alt="Annotation Sidebar"
                 className="img-shadow img-fluid shadow"
                 src="https://getpolarized.io/assets/screenshots/2019-11-document-view.png"/>
        </a>

        <div className="mt-3 mb-3">
             <a href="https://app.getpolarized.io">
                 <Button size="lg" color="success">Load My Doc Repository</Button>
             </a>
         </div>

    </div>
);

const NoAnnotations = () => {
    return (
        <div className="p-2"
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1
             }}>

            <div style={{flexGrow: 1}}>
                <h4 className="text-center text-muted text-xxl">
                    No Annotations
                </h4>

                <p className="text-muted"
                   style={{fontSize: '16px'}}>

                    No annotations have yet been created. To create new
                    annotations create a
                    new <span style={{backgroundColor: "rgba(255,255,0,0.3)"}}>highlight</span> by
                    selecting text in the document.
                </p>

                <p className="text-muted"
                   style={{fontSize: '16px'}}>

                    The highlight will then be shown here and you can
                    then easily attach comments and flashcards to it
                    directly.
                </p>

            </div>

            <div>
                <AppRuntimeRouter browser={(
                    <DeviceRouter desktop={(
                        <LoadRepositoryExplainer/>
                    )}/>
                )}/>
            </div>

        </div>
    );
};

function createItems(props: IRenderProps) {

    // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

    // TODO: I'm not sure what type of class a <div> or React element uses
    // so using 'any' for now.

    const result: any = [];

    const {annotations} = props;

    annotations.map(annotation => {
        result.push (<DocAnnotationComponent key={annotation.id}
                                             annotation={annotation}
                                             persistenceLayerProvider={props.persistenceLayerProvider}
                                             doc={props.doc}/>);
    });


    return result;

}

const AnnotationsBlock = (props: IRenderProps) => {

    if (props.annotations.length > 0) {
        return createItems(props);
    } else {
        return <NoAnnotations/>;
    }

};

const Annotations = (props: IRenderProps) => {

    return <div className="annotations"
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
        <AnnotationsBlock {...props}/>
    </div>;

};

interface AnnotationHeaderProps extends IRenderProps {
    readonly datastoreCapabilities: DatastoreCapabilities;
    readonly onExport: (format: ExportFormat) => void;
    readonly onFiltered: (text: string) => void;

}

const AnnotationHeader = (props: AnnotationHeaderProps) => {

    return (

        <div className="p-1 pb-2 mb-3 border-bottom pl-1 pr-1 text-md">

            <div style={{
                     display: 'flex'
                 }}>

                <div style={{
                         flexGrow: 1
                     }}
                     className="pr-1">

                    <InputFilter style={{flexGrow: 1}}
                                 onChange={text => props.onFiltered(text)}
                                 placeholder="Filter annotations by text"/>

                </div>

                <div>

                    <ExportButton onExport={(format) => props.onExport(format)}/>

                    <FeatureToggle name='groups'>
                        <GroupSharingButton doc={props.doc}
                                            datastoreCapabilities={props.datastoreCapabilities}
                                            onDone={NULL_FUNCTION}/>
                    </FeatureToggle>

                </div>

            </div>

        </div>

    );

};

export class AnnotationSidebar extends React.Component<IProps, IState> {

    private readonly docAnnotationIndex: DocAnnotationIndex;

    private readonly docAnnotationIndexManager: DocAnnotationIndexManager;

    private readonly filtersHandler: AnnotationRepoFiltersHandler;

    constructor(props: IProps, context: any) {
        super(props, context);

        const {persistenceLayerProvider} = this.props;

        this.onFiltered = this.onFiltered.bind(this);

        this.docAnnotationIndex = new DocAnnotationIndex();

        this.docAnnotationIndexManager
            = new DocAnnotationIndexManager(DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider),
                                            this.docAnnotationIndex, annotations => {

                this.setState({
                    data: annotations,
                    annotations
                });

            });

        const filterEngine = new AnnotationRepoFilterEngine<DocAnnotation>(() => this.state.data, this.onFiltered);
        this.filtersHandler = new AnnotationRepoFiltersHandler(filters => filterEngine.onFiltered(filters));

        this.onExport = this.onExport.bind(this);

        this.state = {
            data: [],
            annotations: []
        };

    }

    private onFiltered(annotations: ReadonlyArray<DocAnnotation>) {
        this.setState({annotations});
    }

    public componentDidMount(): void {

        this.init()
            .catch(err => log.error("Failed init: ", err));


    }

    private async init() {

        await this.buildInitialAnnotations();

        await this.registerListenerForPrimaryDocMeta();

        await this.registerListenersForSecondaryDocMetas();

    }

    private async buildInitialAnnotations() {

        const docFileResolver = DocFileResolvers.createForPersistenceLayer(this.props.persistenceLayerProvider);
        const docAnnotations = await DocAnnotations.getAnnotationsForPage(docFileResolver,
                                                                          this.docAnnotationIndex,
                                                                          this.props.doc.docMeta);

        this.docAnnotationIndex.put(...docAnnotations);

        this.reload();

    }

    private async registerListenerForPrimaryDocMeta() {

        const {docMeta} = this.props.doc;

        const userProfile = await UserProfiles.currentUserProfile();

        if (userProfile) {

            DocMetas.withSkippedMutations(docMeta, () => {
                DocMetaRecords.applyAuthorsFromUserProfile(docMeta, userProfile);
            });

        }

        this.docAnnotationIndexManager.registerListenerForDocMeta(docMeta, {noSync: false});

    }

    /**
     * Register listeners for group docs when using Firebase.
     */
    private async registerListenersForSecondaryDocMetas() {

        const user = await Firebase.currentUser();

        if (!user) {
            return;
        }

        const fingerprint = this.props.doc.docMeta.docInfo.fingerprint;

        const docMetaHandler = (docMeta: IDocMeta) => {
            this.docAnnotationIndexManager.registerListenerForDocMeta(docMeta, {noSync: false});
        };

        const errHandler = (err: Error) => {
            log.error("Failed to handle docMeta group group: ", err);
        };

        await DocMetaListeners.register(fingerprint, docMetaHandler, errHandler);

    }

    private reload() {

        const annotations = this.docAnnotationIndex.getDocAnnotationsSorted();

        this.setState({
            annotations
        });

    }

    private onExport(format: ExportFormat) {

        Exporters.doExportFromDocMeta(this.props.persistenceLayerProvider, format, this.props.doc.docMeta)
            .catch(err => log.error(err));

    }

    public render() {

        const persistenceLayer = this.props.persistenceLayerProvider();
        const capabilities = persistenceLayer.capabilities();

        return (

            <div id="annotation-manager"
                 className="annotation-sidebar"
                 style={{
                     display: "flex",
                     flexDirection: "column"
                 }}>

                <AnnotationHeader {...this.state} {...this.props}
                                  onExport={format => this.onExport(format)}
                                  onFiltered={text => this.filtersHandler.update({text})}
                                  datastoreCapabilities={capabilities}/>

                <Annotations {...this.state} {...this.props}/>

            </div>

        );
    }

}

interface IProps {
    readonly doc: Doc;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {

    /**
     * The raw annotations data which is unfiltered.
     */
    readonly data: ReadonlyArray<DocAnnotation>;

    /**
     * The annotations to display in the UI which is (optionally) filtered.
     */
    readonly annotations: ReadonlyArray<DocAnnotation>;

}

interface IRenderProps extends IProps, IState {

}
