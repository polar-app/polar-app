import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {Line} from 'react-chartjs-2';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import * as chartjs from 'chart.js';
import {DocInfo, IDocInfo} from '../../../../web/js/metadata/DocInfo';

const log = Logger.create();

export default class NewDocumentRateChart extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const dateStats = Statistics.computeDocumentsAddedRate(this.props.docInfos);

        const labels = dateStats.map(current => current.date);
        const dataPoints = dateStats.map(current => current.value);

        // https://github.com/jerairrest/react-chartjs-2/blob/master/example/src/components/line.js

        const legend = {display: false};

        const data: chartjs.ChartData = {
            labels,
            datasets: [
                {
                    label: 'Documents Added',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: dataPoints
                },

            ]

        };

        return (

            <div className="p-1">

                <h6 className="text-center">Rate of New Documents</h6>

                <Line data={data} height={100} legend={legend}/>

            </div>

        );
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}
