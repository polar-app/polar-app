import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {Line, Doughnut} from 'react-chartjs-2';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import * as chartjs from 'chart.js';
import {DocInfo, IDocInfo} from '../../../../web/js/metadata/DocInfo';

const log = Logger.create();

export default class TopTagsChart extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const topTags = Statistics.computeTopTags(this.props.docInfos);

        const labels = topTags.map(current => current.key);
        const dataPoints = topTags.map(current => current.value);

        // https://github.com/jerairrest/react-chartjs-2/blob/master/example/src/components/line.js

        const legend = {display: false};
        //
        // 3A405A
        //
        // AEC5EB
        // F9DEC9
        // E9AFA3
        // 685044

        const data: chartjs.ChartData = {
            labels,
            datasets: [
                {
                    label: 'Tag',
                    data: dataPoints,
                    backgroundColor: [
                        '#3A405A',
                        '#AEC5EB',
                        '#F9DEC9',
                        '#E9AFA3',
                        '#685044'
                    ],
                },

            ]

        };

        return (

            <div className="p-1">

                <h6 className="text-center">Top Tags</h6>

                <Doughnut data={data} height={200} legend={legend}/>

            </div>

        );
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}
