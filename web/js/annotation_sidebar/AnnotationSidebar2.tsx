import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocAnnotation} from './DocAnnotation';
import {DocAnnotationComponent} from './annotations/DocAnnotationComponent';
import {ExportButton} from '../ui/export/ExportButton';
import {Exporters, ExportFormat} from '../metadata/exporter/Exporters';
import {PersistenceLayerProvider} from '../datastore/PersistenceLayer';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Doc} from '../metadata/Doc';
import {GroupSharingButton} from '../ui/group_sharing/GroupSharingButton';
import {DocFileResolvers} from "../datastore/DocFileResolvers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FeatureToggle} from "../ui/FeatureToggle";
import {AnnotationRepoFiltersHandler} from "../../../apps/repository/js/annotation_repo/AnnotationRepoFiltersHandler";
import {AnnotationRepoFilterEngine} from "../../../apps/repository/js/annotation_repo/AnnotationRepoFilterEngine";
import {DatastoreCapabilities} from "../datastore/Datastore";
import Button from "reactstrap/lib/Button";
import {DeviceRouter} from "../ui/DeviceRouter";
import {AppRuntimeRouter} from "../ui/AppRuntimeRouter";
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {DocAnnotationLoader} from "./DocAnnotationLoader";
import {DocAnnotationSorter} from "./DocAnnotationSorter";
import {MUISearchBox2} from "../../spectron0/material-ui/MUISearchBox2";
import {MUIPaperToolbar} from "../../spectron0/material-ui/MUIPaperToolbar";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

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

const AnnotationsBlock = (props: IRenderProps) => {

    if (props.view.length > 0) {
        return (
            <>
                {props.view.map(annotation => (
                    <DocAnnotationComponent key={annotation.id}
                                            annotation={annotation}
                                            tagsProvider={props.tagsProvider}
                                            persistenceLayerProvider={props.persistenceLayerProvider}
                                            doc={props.doc}/>))}
            </>
        );

    } else {
        return <NoAnnotations/>;
    }

};

const Annotations = (props: IRenderProps) => {

    return (
        <Paper square
               className="annotations pt-1 pl-1 pr-1"
               style={{
                   flexGrow: 1,
                   display: 'flex',
                   flexDirection: 'column',
                   overflow: 'auto'
               }}>
            <AnnotationsBlock {...props}/>
        </Paper>
    );

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

        <MUIPaperToolbar borderBottom>

            <Box p={1}
                 style={{
                     display: 'flex'
                 }}>

                <MUISearchBox2 style={{flexGrow: 1}}
                               onChange={text => props.onFiltered(text)}
                               placeholder="Filter annotations by text"/>

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

            </Box>

        </MUIPaperToolbar>

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
        this.init();
    }

    private init() {
        this.buildDocAnnotations();
    }

    private buildDocAnnotations() {

        // TODO: this could be faster by not building them if they're not updated
        const handleDocMeta = (docMeta: IDocMeta) => {

            console.time('buildDocAnnotations:handleDocMeta')

            const data = this.docAnnotationLoader.load(docMeta);
            const view = DocAnnotationSorter.sort(data);

            console.timeEnd('buildDocAnnotations:handleDocMeta')

            this.setState({
                data,
                view
            });

        };

        const docMeta = this.props.doc.docMeta;
        handleDocMeta(docMeta);

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
                     flexDirection: "column",
                     minHeight: 0,
                     flexGrow: 1
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
