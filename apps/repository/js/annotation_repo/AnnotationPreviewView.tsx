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
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import DeleteIcon from '@material-ui/icons/Delete';
import Moment from "react-moment";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {RepoDocMetaUpdater} from "../RepoDocMetaLoader";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Divider from "@material-ui/core/Divider";
import {AnnotationTagsButton} from "./buttons/AnnotationTagsButton";
import { AnnotationDeleteButton } from './buttons/AnnotationDeleteButton';

const log = Logger.create();

const Styles: IStyleMap = {

    annotationText: {
        paddingTop: '5px',
    },

};

interface AnnotationImageProps {
    readonly id: string;
    readonly img?: Img;
}

const AnnotationImage = (props: AnnotationImageProps) => {
    return <ResponsiveImg id={props.id} img={props.img} defaultText=" "/>;
};

export interface IProps {

    readonly repoDocMetaUpdater: RepoDocMetaUpdater;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoAnnotation?: IDocAnnotation;

}

export interface IState {

}

export class AnnotationPreviewView extends React.Component<IProps, IState> {

    // FIXME: this shouldn't be here... pass up an event.
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

                <Paper square
                       elevation={0}
                       className="p-1"
                       style={{
                           display: 'flex',
                           flexGrow: 1,
                           flexDirection: 'column'
                       }}>

                    <div style={{display: 'flex'}}
                         className="mb-1">

                        <div className="mt-auto mb-auto"
                             style={{flexGrow: 1}}>

                            <div style={{display: 'flex'}}>

                                <Moment withTitle={true}
                                        titleFormat="D MMM YYYY hh:MM A"
                                        format="MMM DD YYYY HH:mm A"
                                        filter={(value) => value.replace(/^an? /g, '1 ')}>
                                    {repoAnnotation.created}
                                </Moment>

                                <Box color="textSecondary">

                                    (

                                    <Moment withTitle={true}
                                            titleFormat="D MMM YYYY hh:MM A"
                                            fromNow>
                                        {repoAnnotation.created}
                                    </Moment>

                                    )

                                </Box>

                            </div>

                        </div>

                        <div className="ml-auto mt-auto mb-auto">
                            <AnnotationTagsButton tagProvider={this.props.tagsProvider}
                                                  existingTags={this.props.repoAnnotation?.tags ? Object.values(this.props.repoAnnotation?.tags) : []}
                                                  onTagged={this.onTagged}/>
                        </div>

                        <div className="mt-auto mb-auto">
                            <AnnotationDeleteButton onDelete={this.onDelete}/>
                        </div>

                        <Divider orientation="vertical"/>

                        <div className="mt-auto mb-auto">
                            <IconButton onClick={() => this.onDocumentLoadRequested(this.props.repoAnnotation?.docInfo!)}>
                                <OpenInNewIcon/>
                            </IconButton>
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
                        <div dangerouslySetInnerHTML={{__html: repoAnnotation.html || 'no text'}}/>
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
                    
                </Paper>
            );

        } else {

            return (

                <Box p={1}>

                    <div className="text-center">
                        <Typography align="center"
                                    variant="h5"
                                    color="textPrimary">
                            No annotation selected.
                        </Typography>
                    </div>

                </Box>

            );

        }

    }

    private onDelete() {

        if (! this.props.repoAnnotation) {
            log.warn("no repoAnnotation");
            return;
        }

        const {docMeta, annotationType, pageNum, original} = this.props.repoAnnotation;

        AnnotationMutations.delete({docMeta, annotationType, pageNum}, original);

        const doPersist = async () => {

            await this.props.repoDocMetaUpdater.update(docMeta, 'deleted');

            const persistenceLayer = this.props.persistenceLayerManager.get();
            await persistenceLayer.writeDocMeta(docMeta);

        };

        doPersist()
            .catch(err => log.error(err));

    }

    private onUpdate() {

        if (! this.props.repoAnnotation) {
            return;
        }

        const {docMeta, annotationType, pageNum, original} = this.props.repoAnnotation;

        AnnotationMutations.update({docMeta, annotationType, pageNum}, {...original});

    }

    private onDocumentLoadRequested(docInfo: IDocInfo) {

        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        this.synchronizingDocLoader.load(docInfo.fingerprint, backendFileRef!)
            .catch(err => log.error("Unable to load doc: ", err));

    }

    private onTagged(tags: ReadonlyArray<Tag>) {

        const annotation = this.props.repoAnnotation!;
        const {docMeta, pageNum, annotationType} = annotation;
        const updates = {tags: Tags.toMap(tags)};

        setTimeout(() => {

            AnnotationMutations.update({docMeta, pageNum, annotationType},
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


