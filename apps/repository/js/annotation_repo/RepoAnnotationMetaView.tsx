import * as React from 'react';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {TableColumns} from '../TableColumns';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
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
        marginRight: '10px'
    },

    metaValue: {
        paddingLeft: '5px',
        display: 'table-cell',
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


    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            data: [],
            columns: new TableColumns()
        };

    }

    public render() {

        if (this.props.repoAnnotation) {

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
                                    {this.props.repoAnnotation.created}
                                </Moment>

                                <div style={Styles.relativeTime}>

                                    (

                                    <Moment withTitle={true}
                                            titleFormat="D MMM YYYY hh:MM A"
                                            fromNow>
                                        {this.props.repoAnnotation.created}
                                    </Moment>

                                    )

                                </div>

                            </div>

                        </div>

                        <div style={Styles.metaTableRow}>

                            <div style={Styles.metaField}>Tags</div>

                            <div style={Styles.metaValue}>

                                <FormattedTags tags={this.props.repoAnnotation.tags || {}}/>

                            </div>

                        </div>

                        <div style={Styles.metaTableRow}>

                            <div style={Styles.metaField}>Doc</div>

                            <div style={Styles.metaValue}>

                                {this.props.repoAnnotation.docInfo.title}

                            </div>

                        </div>

                    </div>

                    <div style={Styles.annotationText}>
                        {this.props.repoAnnotation.text}
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

}

export interface IProps {

    readonly repoAnnotation?: RepoAnnotation;
}

export interface IState {

}
