import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {RepoDocMetaLoader} from './RepoDocMetaLoader';
import {RepoDocMetaManager} from './RepoDocMetaManager';
import {FilteredTags} from './FilteredTags';
import {DocRepoTableColumns} from './doc_repo/DocRepoTableColumns';
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher} from '../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import DocRepoTable from './doc_repo/DocRepoTable';
import {RepoSidebar} from './RepoSidebar';
import {CloudAuthButton} from '../../../web/js/ui/cloud_auth/CloudAuthButton';

const log = Logger.create();

export class SplitBar extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-bar pl-0 pr-0 mb-1">

                <div style={{display: 'flex'}}>

                    {this.props.children}

                </div>

            </div>
        );
    }

}

export class SplitBarLeft extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-bar-left"
                 style={{marginTop: 'auto', marginBottom: 'auto', width: '250px'}}>

                {this.props.children}

            </div>

        );
    }

}

export class SplitBarRight extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-bar-right"
                 style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', justifyContent: 'flex-end', width: '100%'}}>

                {this.props.children}

            </div>

        );
    }

}
