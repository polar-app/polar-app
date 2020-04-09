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
import {
    DocMetaListeners,
    DocMetaRecords
} from "../datastore/sharing/db/DocMetaListeners";
import {DocMetas} from "../metadata/DocMetas";
import {UserProfiles} from "../datastore/sharing/db/UserProfiles";
import {DocAnnotationIndexManager} from "./DocAnnotationIndexManager";
import {DocFileResolvers} from "../datastore/DocFileResolvers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FeatureToggle} from "../ui/FeatureToggle";
import {InputFilter} from '../ui/input_filter/InputFilter2';
import {AnnotationRepoFiltersHandler} from "../../../apps/repository/js/annotation_repo/AnnotationRepoFiltersHandler";
import {AnnotationRepoFilterEngine} from "../../../apps/repository/js/annotation_repo/AnnotationRepoFilterEngine";
import {
    DatastoreCapabilities,
    DocMetaSnapshot,
    DocMetaSnapshotError
} from "../datastore/Datastore";
import Button from "reactstrap/lib/Button";
import {DeviceRouter} from "../ui/DeviceRouter";
import {AppRuntimeRouter} from "../ui/AppRuntimeRouter";
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {DocMetaTransformer} from "../metadata/DocMetaTransformer";
import {DocAnnotationLoader} from "./DocAnnotationLoader";
import {DocAnnotationSorter} from "./DocAnnotationSorter";

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

    const {view} = props;

    view.map(annotation => {
        result.push (<DocAnnotationComponent key={annotation.id}
                                             annotation={annotation}
                                             tagsProvider={props.tagsProvider}
                                             persistenceLayerProvider={props.persistenceLayerProvider}
                                             doc={props.doc}/>);
    });


    return result;

}

const AnnotationsBlock = (props: IRenderProps) => {

    if (props.view.length > 0) {
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
                    flexDirection: 'column',
                    overflow: 'auto'
                }}>
        <AnnotationsBlock {...props}/>
    </div>;

};

interface AnnotationHeaderProps extends IRenderProps {
    readonly datastoreCapabilities: DatastoreCapabilities;
    readonly onExport: (format: ExportFormat) => void;
    readonly onFiltered: (text: string) => void;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly doc: Doc;

}

const AnnotationHeader = (props: AnnotationHeaderProps) => {

    const onTagged = (tags: ReadonlyArray<Tag>) => {
        props.doc.docInfo.tags = Tags.toMap(tags);
    };

    return (

        <div className="p-1 border-bottom pl-1 pr-1 text-md">

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

                <div style={{display: 'flex'}}>

                    {/*<div className="mt-auto mb-auto mr-1">*/}
                    {/*    <TagInput placement="bottom"*/}
                    {/*              container="#annotation-manager"*/}
                    {/*              size="md"*/}
                    {/*              className='text-muted border'*/}
                    {/*              availableTags={props.tagsProvider()}*/}
                    {/*              existingTags={() => props.doc.docInfo.tags ? Object.values(props.doc.docInfo.tags) : []}*/}
                    {/*              onChange={(tags) => onTagged(tags)}/>*/}
                    {/*</div>*/}

                    <div className="mt-auto mb-auto">
                        <ExportButton onExport={(format) => props.onExport(format)}/>
                    </div>

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

/**
 * Second version of the sidebar that is more react-ish...
 */
export class AnnotationSidebar2 extends React.Component<IProps, IState> {

    private readonly docAnnotationLoader: DocAnnotationLoader;

    private readonly filtersHandler: AnnotationRepoFiltersHandler;

    constructor(props: IProps, context: any) {
        super(props, context);

        const {persistenceLayerProvider} = this.props;

        this.onFiltered = this.onFiltered.bind(this);

        const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);

        this.docAnnotationLoader = new DocAnnotationLoader(docFileResolver);

        const filterEngine
            = new AnnotationRepoFilterEngine<DocAnnotation>(() => this.state.data,
                                                            (filters) => this.onFiltered(filters));

        this.filtersHandler = new AnnotationRepoFiltersHandler(filters => filterEngine.onFiltered(filters));

        this.onExport = this.onExport.bind(this);

        this.state = {
            data: [],
            view: []
        };

    }

    private onFiltered(view: ReadonlyArray<DocAnnotation>) {
        this.setState({view});
    }

    public componentDidMount(): void {

        this.init()
            .catch(err => log.error("Failed init: ", err));

    }

    private async init() {

        await this.buildDocAnnotations();

    }

    private async buildDocAnnotations() {

        // TODO: this could be faster by not building them if they're not updated
        const handleDocMeta = async (docMeta: IDocMeta) => {

            const data = this.docAnnotationLoader.load(docMeta);
            const view = DocAnnotationSorter.sort(data);

            this.setState({
                data,
                view
            });

        };

        const docMeta = this.props.doc.docMeta;
        await handleDocMeta(docMeta);

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
    readonly tagsProvider: () => ReadonlyArray<Tag>;
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
    readonly view: ReadonlyArray<DocAnnotation>;

}

interface IRenderProps extends IProps, IState {

}
