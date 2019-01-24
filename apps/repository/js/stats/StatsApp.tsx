import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import NewDocumentRateChart from './NewDocumentRateChart';
import TopTagsChart from './TopTagsChart';
import TopTagsTable from './TopTagsTable';
import {MessageBanner} from '../MessageBanner';
import {FixedNav, FixedNavBody} from '../FixedNav';

const log = Logger.create();

export default class StatsApp extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const docInfos =
            Object.values(this.props.repoDocMetaManager.repoDocInfoIndex)
                .map(current => current.docInfo);

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoSidebar/>

                    <MessageBanner/>

                </header>

                <FixedNavBody>

                    <div className="container-fluid border-top">

                        <div className="row mt-2">

                            <div className="col-lg-12">
                                <NewDocumentRateChart docInfos={docInfos}/>
                            </div>

                        </div>

                        <div className="row mt-2">

                            <div className="col-lg-8">
                                <TopTagsChart docInfos={docInfos}/>
                            </div>

                            <div className="col-lg-4">
                                <TopTagsTable docInfos={docInfos}/>
                            </div>

                        </div>

                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly repoDocMetaManager: RepoDocMetaManager;
}

export interface IState {

}
