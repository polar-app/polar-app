import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {Line} from 'react-chartjs-2';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import * as chartjs from 'chart.js';
import NewDocumentRateChart from './NewDocumentRateChart';
import DonationsCard from '../community/DonationsCard';
import GithubStarsCard from '../community/GithubStarsCard';
import TopTagsChart from './TopTagsChart';
import ExampleLineChart from './ExampleLineChart';

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

            <div id="doc-repository">

                <header>

                    <RepoSidebar/>

                </header>

                <div className="container-fluid">

                    <div className="row mt-2">

                        <div className="col-lg-12">
                            <ExampleLineChart/>
                            <NewDocumentRateChart docInfos={docInfos}/>
                        </div>

                        <div className="col-lg-12">
                            <TopTagsChart docInfos={docInfos}/>
                        </div>

                    </div>


                </div>

            </div>

        );
    }

}

export interface IProps {
    readonly repoDocMetaManager: RepoDocMetaManager;
}

export interface IState {

}
