import * as React from 'react';
import {Logger} from '../logger/Logger';
import {Comment} from '../metadata/Comment';
import {DocAnnotations} from './DocAnnotations';
import {DocAnnotation} from './DocAnnotation';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotationIndexes} from './DocAnnotationIndexes';
import {AreaHighlightModel} from '../highlights/area/model/AreaHighlightModel';
import {MutationType} from '../proxies/MutationType';
import {TextHighlightModel} from '../highlights/text/model/TextHighlightModel';
import {isPresent} from '../Preconditions';
import {DocAnnotationComponent} from './annotations/DocAnnotationComponent';
import {CommentModel} from './CommentModel';
import {Refs} from '../metadata/Refs';
import {FlashcardModel} from './FlashcardModel';
import {Flashcard} from '../metadata/Flashcard';
import {ExportButton} from '../ui/export/ExportButton';
import {Exporters, ExportFormat} from '../metadata/exporter/Exporters';
import {SplitBar, SplitBarLeft, SplitBarRight} from '../../../apps/repository/js/SplitBar';
import {PersistenceLayerProvider} from '../datastore/PersistenceLayer';
import {Visibility} from '../datastore/Datastore';
import {PersistenceLayers} from '../datastore/PersistenceLayers';
import {SharingDatastores} from '../datastore/SharingDatastores';
import {ShareContentButton} from '../apps/viewer/ShareContentButton';
import {NULL_FUNCTION} from '../util/Functions';
import {Doc} from '../metadata/Doc';
import {AreaHighlight} from '../metadata/AreaHighlight';

const log = Logger.create();

const NoAnnotations = () => {
    return (
        <div className="p-2">

            <h4 className="text-center text-muted">
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
    );
};



function createItems(render: IRender) {

    // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

    // TODO: I'm not sure what type of class a <div> or React element uses
    // so using 'any' for now.

    const result: any = [];

    const {annotations} = render;

    annotations.map(annotation => {
        result.push (<DocAnnotationComponent key={annotation.id}
                                             annotation={annotation}
                                             persistenceLayerProvider={render.persistenceLayerProvider}
                                             doc={render.doc}/>);
    });


    return result;

}

const AnnotationsBlock = (render: IRender) => {

    if (render.annotations.length > 0) {
        return createItems(render);
    } else {
        return <NoAnnotations/>;
    }

};

const Annotations = (render: IRender) => {

    return <div className="annotations">
        <AnnotationsBlock {...render}/>
    </div>;

};

export class AnnotationSidebar extends React.Component<IProps, IState> {

    private docAnnotationIndex: DocAnnotationIndex = new DocAnnotationIndex();

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onExport = this.onExport.bind(this);

        this.state = {
            annotations: []
        };

    }

    private async init() {

        const annotations = await DocAnnotations.getAnnotationsForPage(this.props.persistenceLayerProvider,
                                                                       this.props.doc.docMeta);

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, ...annotations);

        this.setState({
            annotations: this.docAnnotationIndex.sortedDocAnnotations
        });

    }

    public componentDidMount(): void {

        this.init()
            .catch(err => log.error("Failed init: ", err));

        // TODO: remove all these listeners when the component unmounts... in
        // our case though it never unmounts

        const {docMeta} = this.props.doc;

        new AreaHighlightModel().registerListener(docMeta, annotationEvent => {

            const handleConversion = () => {

                const converter = (annotationValue: AreaHighlight) => {

                    const {persistenceLayerProvider} = this.props;
                    return DocAnnotations.createFromAreaHighlight(persistenceLayerProvider,
                                                                  docMeta,
                                                                  annotationValue,
                                                                  annotationEvent.pageMeta);
                };

                const docAnnotation =
                    this.convertAnnotation(annotationEvent.value, converter);

                this.handleAnnotationEvent(annotationEvent.id,
                                           annotationEvent.traceEvent.mutationType,
                                           docAnnotation);

            };

            handleConversion();

        });

        new TextHighlightModel().registerListener(this.props.doc.docMeta, annotationEvent => {

            const docAnnotation =
                this.convertAnnotation(annotationEvent.value,
                                       annotationValue => DocAnnotations.createFromTextHighlight(docMeta,
                                                                                                 annotationValue,
                                                                                                 annotationEvent.pageMeta));

            this.handleAnnotationEvent(annotationEvent.id,
                                       annotationEvent.traceEvent.mutationType,
                                       docAnnotation);
        });

        new CommentModel().registerListener(this.props.doc.docMeta, annotationEvent => {

            const comment: Comment = annotationEvent.value || annotationEvent.previousValue;
            const childDocAnnotation = DocAnnotations.createFromComment(docMeta, comment, annotationEvent.pageMeta);

            this.handleChildAnnotationEvent(annotationEvent.id,
                                            annotationEvent.traceEvent.mutationType,
                                            childDocAnnotation);

        });

        new FlashcardModel().registerListener(this.props.doc.docMeta, annotationEvent => {

            const flashcard: Flashcard = annotationEvent.value || annotationEvent.previousValue;
            const childDocAnnotation = DocAnnotations.createFromFlashcard(docMeta, flashcard, annotationEvent.pageMeta);

            this.handleChildAnnotationEvent(annotationEvent.id,
                                            annotationEvent.traceEvent.mutationType,
                                            childDocAnnotation);

        });

    }

    private convertAnnotation<T>(value: any | undefined | null, converter: (input: any) => T) {

        if (! isPresent(value)) {
            return undefined;
        }

        return converter(value);

    }

    private handleChildAnnotationEvent(id: string,
                                       mutationType: MutationType,
                                       childDocAnnotation: DocAnnotation) {

        if (! childDocAnnotation.ref) {
            // this is an old annotation.  We can't show it in the sidebar yet.
            log.warn("Annotation hidden from sidebar: ", childDocAnnotation);
            return;
        }

        const ref = Refs.parse(childDocAnnotation.ref!);

        const annotation = this.docAnnotationIndex.docAnnotationMap[ref.value];

        if (! annotation) {
            log.warn("No annotation for ref:", ref.value);
            return;
        }

        if (! annotation.children) {
            annotation.children = [];
        }

        if (mutationType !== MutationType.DELETE) {

            annotation.children.push(childDocAnnotation);
            annotation.children.sort((c0, c1) => -c0.created.localeCompare(c1.created));

        } else {

            annotation.children =
                annotation.children.filter(current => current.id !== id);

        }

        this.reload();


    }

    private handleAnnotationEvent(id: string,
                                  mutationType: MutationType,
                                  docAnnotation: DocAnnotation | undefined) {

        if (mutationType === MutationType.DELETE) {

            this.docAnnotationIndex
                = DocAnnotationIndexes.delete(this.docAnnotationIndex, id);

            this.reload();

        } else {
            this.refresh(docAnnotation!);
        }

    }

    private refresh(docAnnotation: DocAnnotation) {

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, docAnnotation);

        this.reload();

    }

    private reload() {

        this.setState({
            annotations: this.docAnnotationIndex.sortedDocAnnotations
        });

    }

    private onExport(path: string, format: ExportFormat) {

        Exporters.doExport(path, format, this.props.doc.docMeta)
            .catch(err => log.error(err));

    }

    public render() {

        const { annotations } = this.state;

        const persistenceLayer = this.props.persistenceLayerProvider();
        const capabilities = persistenceLayer.capabilities();

        const sharingEnabled =
            this.props.doc.mutable &&
            sessionStorage.getItem('sharing-enabled') === "true";

        const AnnotationHeader = () => {

            const docMeta = this.props.doc.docMeta;

            const onVisibilityChanged = async (visibility: Visibility) => {
                await PersistenceLayers.changeVisibility(persistenceLayer, docMeta, visibility);
            };

            const createShareLink = async (): Promise<string | undefined> => {
                return SharingDatastores.createURL(persistenceLayer, docMeta);
            };

            if (annotations.length === 0) {
                return (<div></div>);
            }

            return (

                <div className="p-1 pb-2 mb-3 border-bottom pl-1 pr-1">

                    <SplitBar>

                        <SplitBarLeft>
                            <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                 }}>
                                Annotations
                            </div>
                        </SplitBarLeft>

                        <SplitBarRight>

                            <ExportButton onExport={(path, format) => this.onExport(path, format)}/>

                            <ShareContentButton hidden={! sharingEnabled}
                                                datastoreCapabilities={capabilities}
                                                createShareLink={createShareLink}
                                                visibility={docMeta.docInfo.visibility}
                                                onVisibilityChanged={onVisibilityChanged}
                                                onDone={NULL_FUNCTION}/>


                        </SplitBarRight>


                    </SplitBar>

                </div>

            );

        };

        return (

            <div id="annotation-manager" className="annotation-sidebar">

                <AnnotationHeader/>

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
    readonly annotations: DocAnnotation[];
}

interface IRender extends IProps, IState {

}
