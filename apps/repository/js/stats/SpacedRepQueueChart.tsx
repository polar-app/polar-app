import * as React from 'react';
import StatTitle from './StatTitle';
import {LineDatum, LineSerieData, ResponsiveLine} from '@nivo/line';
import {SpacedRepStatRecord} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {Statistics} from "polar-shared/src/util/Statistics";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {ReviewerStatistics} from "../reviewer/ReviewerStatistics";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class SpacedRepQueueChart extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);

        this.state = {
            data: []
        };

        ReviewerStatistics.queueStatistics(this.props.mode)
            .then(data => this.setState({data}))
            .catch(err => log.error("Could not fetch queue stats: ", err));

    }

    public render() {


        const computeStats = () => {

            // TODO: limit on the most recent N points so that I don't crowd up the UI BUT the points need to be
            // extrapolated including gaps for time because I could have one datapoint 5 years ago and another today
            // and the interpolated points shown in the graph would be too many

            const datapointsReducer = (timestamp: ISODateTimeString,
                                       datapoints: ReadonlyArray<SpacedRepStatRecord>): SpacedRepStatRecord => {

                const first = datapoints[0];
                return {
                    ...first,
                    created: timestamp
                }
            };

            return Statistics.compute(this.state.data, datapointsReducer);

        };

        const stats = computeStats();

        const computeLineData = () => {

            type StatID = 'nrLearning' | 'nrReview' | 'nrLapsed';

            // const computeLine = (id: StatID): LineSerieData => {
            //     return {
            //         id,
            //         data: [
            //             // {x: new Date('2019-11-01'), y: 100},
            //             // {x: '2019-11-01', y: 100},
            //             // {x: '2019-11-02', y: 150},
            //             // {x: '2019-11-03', y: 120},
            //         ]
            //     }
            // };

            const toDataPoint = (spacedRepStat: SpacedRepStatRecord, id: StatID): LineDatum => {

                const x = ISODateTimeStrings.parse(spacedRepStat.created);
                // const y = spacedRepStat.nrLearning;
                const y = (spacedRepStat as any)[id];
                return {x, y};

            };

            const computeLine = (id: StatID): LineSerieData => {
                return {
                    id,
                    data: stats.map(current => toDataPoint(current, id))
                }
            };

            return [
                computeLine('nrLearning'),
                computeLine('nrReview'),
                computeLine('nrLapsed')
            ];

        };

        const data: LineSerieData[] = computeLineData();

        const NeedChardData = () => {
            // return <div className="text-lg text-muted mt-2"
            //             style={{
            //                 display: 'flex',
            //                 height: '100%'
            //             }}>
            //
            //     <div className="m-auto">
            //         More data needed for reliable chart.
            //     </div>
            // </div>;

            return <div/>;

        };

        const Chart = () => {

            return (

                <div className="p-1"
                     style={{height: '300px', width: '100%'}}>

                    <StatTitle>Number of tasks for {this.props.mode}</StatTitle>

                    <ResponsiveLine
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            bottom: 50,
                            left: 40
                        }}
                        // padding={0.3}
                        colors="set1"
                        colorBy="id"
                        enableArea={true}
                        yScale={{
                            type: 'linear'
                        }}
                        xScale={{
                            type: 'time',
                            // format: '%Y-%m-%dT%h:%m:%s.%msZ',
                            // format: '%Y-%m-%d',
                            // precision: 'day',
                        }}
                        // xFormat="time:%Y-%m-%d"
                        axisBottom={{
                            format: '%b %d',
                            // tickValues: ['every 2 days', 'every 2 days', 'every 2 days'],
                            tickValues: 5,
                            // legend: 'time scale',
                            // legendOffset: -12,
                        }}
                        // useMesh={true}
                        // enablePointLabel={true}
                        animate={true}

                    />

                </div>

            );

        };

        const Main = () => {

            if (data[0].data.length < 3) {
                return <NeedChardData/>;
            } else {
                return <Chart/>;
            }

        };

        return <div className="p-1"
                    style={{}}>

            <Main/>

        </div>;

    }

}

export interface IProps {
    readonly mode: RepetitionMode;
}

export interface IState {
    readonly data: ReadonlyArray<SpacedRepStatRecord>;
}


