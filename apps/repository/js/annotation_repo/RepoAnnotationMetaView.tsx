import * as React from 'react';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {TableColumns} from '../TableColumns';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {IDocInfo, DocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoHeader} from '../RepoHeader';
import {MessageBanner} from '../MessageBanner';
import AnnotationRepoTable from './AnnotationRepoTable';
import {Footer, Tips} from '../Utils';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {DateTimeTableCell} from '../DateTimeTableCell';
import Moment from 'react-moment';
import {FormattedTags} from '../FormattedTags';
import {Hashcode} from '../../../../web/js/metadata/Hashcode';
import {Logger} from '../../../../web/js/logger/Logger';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import {Button} from 'reactstrap';

const log = Logger.create();

const Styles: IStyleMap = {

    metaTable: {
        display: 'table'
    },

    metaTableRow: {
        display: 'table-row'
    },

    metaField: {
        display: 'table-cell',
        // fontWeight: 'bold',
        color: 'var(--secondary)',
        marginRight: '10px',
        verticalAlign: 'top'
    },

    metaValue: {
        paddingLeft: '5px',
        display: 'table-cell',
        verticalAlign: 'top'
    },

    annotationText: {
        paddingTop: '5px'
    },

    relativeTime: {
        marginLeft: '5px',
        color: 'var(--secondary)',
        display: 'inline'
    }

};
export class RepoAnnotationMetaView extends React.Component<IProps, IState> {

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.synchronizingDocLoader = new SynchronizingDocLoader(this.props.persistenceLayerManager);

        this.state = {
            data: [],
            columns: new TableColumns()
        };

    }

    public render() {

        if (this.props.repoAnnotation) {

            const repoAnnotation = this.props.repoAnnotation;

            return (

                <div>

                    <div style={Styles.metaTable}>

                        <div style={Styles.metaTableRow}>
                            <div style={Styles.metaField}>Created</div>

                            <div style={Styles.metaValue}>

                                <Moment withTitle={true}
                                        titleFormat="D MMM YYYY hh:MM A"
                                        format="MMM DD YYYY HH:mm A"
                                        filter={(value) => value.replace(/^an? /g, '1 ')}>
                                    {repoAnnotation.created}
                                </Moment>

                                <div style={Styles.relativeTime}>

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

                        <div style={Styles.metaTableRow}>

                            <div style={Styles.metaField}>Tags</div>

                            <div style={Styles.metaValue}>

                                <FormattedTags tags={repoAnnotation.tags || {}}/>

                            </div>

                        </div>

                        <div style={Styles.metaTableRow}>

                            <div style={Styles.metaField}>Doc</div>

                            <div style={Styles.metaValue}>

                                {/*TODO: make this into a TextLink component*/}

                                <Button onClick={() => this.onDocumentLoadRequested(repoAnnotation.docInfo)}
                                        style={{whiteSpace: 'normal', textAlign: 'left'}}
                                        className="p-0"
                                        size="sm"
                                        color="link">

                                    {repoAnnotation.docInfo.title}

                                </Button>

                            </div>

                        </div>

                    </div>

                    <div style={Styles.annotationText}>
                        {repoAnnotation.text}
                    </div>

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

        this.synchronizingDocLoader.load(docInfo.fingerprint,
                                         docInfo.filename!,
                                         docInfo.hashcode)
            .catch(err => log.error("Unable to load doc: ", err));

    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoAnnotation?: RepoAnnotation;
}

export interface IState {

}
