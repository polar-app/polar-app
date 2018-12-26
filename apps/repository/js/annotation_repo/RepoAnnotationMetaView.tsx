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
                    {this.props.repoAnnotation.text}
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
