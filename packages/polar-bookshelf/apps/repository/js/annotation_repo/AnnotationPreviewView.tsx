import * as React from 'react';
import {DocRepoTableColumns} from '../doc_repo/DocRepoTableColumns';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {Logger} from 'polar-shared/src/logger/Logger';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import {Either} from '../../../../web/js/util/Either';
import {BackendFileRefs} from '../../../../web/js/datastore/BackendFileRefs';
import {Img} from 'polar-shared/src/metadata/Img';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DocPropTable} from "./meta_view/DocPropTable";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {Button} from "reactstrap";
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import {DeleteIcon} from "../../../../web/js/ui/icons/FixedWidthIcons";
import Moment from "react-moment";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import {TagInputControl} from "../TagInputControl";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {RepoDocMetaUpdater} from "../RepoDocMetaLoader";

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

export class AnnotationPreviewView extends React.Component<IProps, IState> {

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.synchronizingDocLoader = new SynchronizingDocLoader(() => this.props.persistenceLayerManager.get());

        this.state = {
            data: [],
            columns: new DocRepoTableColumns()
        };

    }

    public render() {

        if (this.props.repoAnnotation) {

            const repoAnnotation = this.props.repoAnnotation;

            return (

                <div className="pl-2 pr-2 pt-1 pb-1">

                    <div style={{display: 'flex'}} className="mb-1">

                        <div className="mt-auto mb-auto"
                             style={{flexGrow: 1}}>

                            <div style={{display: 'flex'}}>

                                <Moment withTitle={true}
                                        titleFormat="D MMM YYYY hh:MM A"
                                        format="MMM DD YYYY HH:mm A"
                                        filter={(value) => value.replace(/^an? /g, '1 ')}>
                                    {repoAnnotation.created}
                                </Moment>

                                <div className="text-secondary pl-1">

                                    (

                                    <Moment withTitle={true}
                                            titleFormat="D MMM YYYY hh:MM A"
                                            fromNow>
                                        {repoAnnotation.created}
                                    </Moment>

                                    )

                                </div>

                            </div>

                        </div>

                        <div className="mt-auto mb-auto">
                            <TagInputControl className='ml-1 p-1 text-muted'
                                             container="body"
                                             availableTags={this.props.tagsProvider()}
                                             existingTags={() => this.props.repoAnnotation?.tags ? Object.values(this.props.repoAnnotation?.tags) : []}
                                             onChange={(tags) => this.onTagged(tags)}/>
                        </div>

                        <div className="mt-auto mb-auto">
                            <Button size="md"
                                    color="clear"
                                    className="m-0 p-0 text-muted"
                                    onClick={() => this.onDelete()}>
                                <DeleteIcon/>
                            </Button>
                        </div>

                    </div>

                    <div style={{display: 'flex'}}>

                        <div style={{flexGrow: 1, verticalAlign: 'top'}}>

                            <DocPropTable repoAnnotation={repoAnnotation}
                                          onDocumentLoadRequested={docInfo => this.onDocumentLoadRequested(docInfo)}/>

                        </div>

                        <div>
                            {/*<DocThumbnail thumbnails={repoAnnotation.docInfo.thumbnails}*/}
                            {/*              persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}/>*/}
                        </div>

                    </div>

                    <div style={Styles.annotationText}>
                        {repoAnnotation.text}
                    </div>

                    <AnnotationImage id={repoAnnotation.id} img={repoAnnotation.img}/>

                    {/*<DocAnnotationComponent persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}*/}
                    {/*                        annotation={repoAnnotation}*/}
                    {/*                        doc={{*/}
                    {/*                            oid: 123,*/}
                    {/*                            docInfo: repoAnnotation.docInfo,*/}
                    {/*                            docMeta: repoAnnotation.docMeta,*/}
                    {/*                            permission: {*/}
                    {/*                                mode: 'rw'*/}
                    {/*                            },*/}
                    {/*                            mutable: true*/}
                    {/*                        }}/>*/}

                    {/*FIXME: I need to figure out how to get the 'doc' now*/}
                    {/*<AnnotationControlBar doc={} annotation={}/>*/}

                </div>

            );

        } else {

            return (

                <div className="text-muted text-center text-xl m-3">
                    No annotation selected.
                </div>

            );

        }

    }

    private onDelete() {

        if (! this.props.repoAnnotation) {
            log.warn("no repoAnnotation");
            return;
        }

        const {docMeta, annotationType, original} = this.props.repoAnnotation;

        const onConfirm = () => {

            AnnotationMutations.delete(docMeta, annotationType, original);

            const doPersist = async () => {

                await this.props.repoDocMetaUpdater.update(docMeta, 'deleted');

                const persistenceLayer = this.props.persistenceLayerManager.get();
                await persistenceLayer.writeDocMeta(docMeta);

            };

            doPersist()
                .catch(err => log.error(err));

        };

        Dialogs.confirm({
            title: "Are you sure you want to delete this item? ",
            subtitle: "This is a permanent operation and can't be undone. ",
            type: "danger",
            onConfirm: ()  => onConfirm()
        });

    }

    private onUpdate() {

        if (! this.props.repoAnnotation) {
            return;
        }

        const {docMeta, annotationType, original} = this.props.repoAnnotation;

        AnnotationMutations.update(docMeta, annotationType, original);

    }

    private onDocumentLoadRequested(docInfo: IDocInfo) {

        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        this.synchronizingDocLoader.load(docInfo.fingerprint, backendFileRef!)
            .catch(err => log.error("Unable to load doc: ", err));

    }

    private onTagged(tags: ReadonlyArray<Tag>) {

        const annotation = this.props.repoAnnotation!;
        const docMeta = annotation.docMeta;
        const updates = {tags: Tags.toMap(tags)};

        setTimeout(() => {

            AnnotationMutations.update(docMeta,
                                       annotation.annotationType,
                                       {...annotation.original, ...updates});

            const doPersist = async () => {

                await this.props.repoDocMetaUpdater.update(docMeta, 'updated');

                const persistenceLayer = this.props.persistenceLayerManager.get();
                await persistenceLayer.writeDocMeta(docMeta);

            };

            doPersist()
                .catch(err => log.error(err));

        }, 1);

    }

}

export interface IProps {

    readonly repoDocMetaUpdater: RepoDocMetaUpdater;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoAnnotation?: IDocAnnotation;
}

export interface IState {

}

