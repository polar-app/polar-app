import * as React from 'react';
import StatTitle from './StatTitle';
import {Datum, ResponsiveLine, Serie} from '@nivo/line';
import {SpacedRepStat, StatType} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
import {Statistics} from "polar-shared/src/util/Statistics";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Logger} from "polar-shared/src/logger/Logger";
import {StatBox} from "./StatBox";
import {minDatapointsReducer, sumDatapointsReducer} from './StatisticsReducers';
import {useNivoTheme} from "./NivoHooks";
import useTheme from '@material-ui/core/styles/useTheme';
import {
    useSpacedRepCollectionSnapshotForModeAndType
} from "../../../../web/js/snapshot_collections/UseSpacedRepStatCollectionSnapshot";

const HEIGHT = '300px';

const log = Logger.create();

interface ChartProps {
    readonly type: 'queue' | 'completed';
    readonly lineData: Serie[];
}

const Chart = React.memo(function Chart(props: ChartProps) {

    const nivoTheme = useNivoTheme();
    const theme = useTheme();

    const createTitle = () => {
        switch (props.type) {
            case "queue":
                return "Number of tasks pending (queue length)";
            case "completed":
                return "Number of tasks completed";
        }
    };

    const title = createTitle();

    return (

        <StatBox>
            <>
                <StatTitle>{title}</StatTitle>

                <div style={{
                         height: HEIGHT,
                         width: '100%'
                     }}>

                    <ResponsiveLine
                        data={props.lineData}
                        isInteractive={true}
                        margin={{
                            top: 10,
                            right: 10,
                            bottom: 50,
                            left: 40
                        }}
                        // padding={0.3}
                        colors={{ scheme: 'nivo' }}
                        // colorBy="id"
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
                        theme={nivoTheme}
                        legends={[{
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 50,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemsSpacing: 4,
                            symbolSize: 20,
                            symbolShape: 'circle',
                            itemDirection: 'left-to-right',
                            itemTextColor: theme.palette.text.secondary,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        // itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }]}
                    />
                </div>
            </>
        </StatBox>

    );

});

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

export const SpacedRepQueueChart = React.memo((props: IProps) => {

    const snapshot = useSpacedRepCollectionSnapshotForModeAndType(props.mode, props.type);

    // TODO: these need better stats sections for incremental reading and flashcards as we should have counts,
    // forecasting, and completed for all...

    const computeStats = React.useCallback(() => {

        // TODO: limit on the most recent N points so that I don't crowd up the UI BUT the points need to be
        // extrapolated including gaps for time because I could have one datapoint 5 years ago and another today
        // and the interpolated points shown in the graph would be too many

        // TODO:
        //  - create synthetic 'zero' values for days we don't actually do any work..
        //

        const createDatapointsReducer = () => {
            switch (props.type) {
                case "queue":
                    return minDatapointsReducer;
                case "completed":
                    return sumDatapointsReducer;
            }
        };

        const emptyDatapointFactory = (created: ISODateTimeString): SpacedRepStat => {

            return {
                created,
                type: props.type,
                mode: props.mode,
                nrNew: 0,
                nrLapsed: 0,
                nrLearning: 0,
                nrReview: 0
            };

        };

        return Statistics.compute(snapshot.map(current => current.data()),
                                  createDatapointsReducer(),
                                  emptyDatapointFactory);

    }, [props.mode, props.type, snapshot]);

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

        const toDataPoint = (spacedRepStat: SpacedRepStat, id: StatID): Datum => {

            const x = ISODateTimeStrings.parse(spacedRepStat.created);
            // const y = spacedRepStat.nrLearning;
            const y = (spacedRepStat as any)[id];
            return {x, y};

        };

        const computeLine = (id: StatID): Serie => {
            return {
                id,
                data: stats.map(current => toDataPoint(current, id))
            };
        };

        return [
            computeLine('nrLearning'),
            computeLine('nrReview'),
            computeLine('nrLapsed')
        ];

    };

    const lineData: Serie[] = computeLineData();

    const Main = () => {

        if (lineData[0].data.length < 3) {
            return <NeedChardData/>;
        } else {
            return <Chart type={props.type}
                          lineData={lineData}/>;
        }

    };

    return (
        <div>
            <Main/>
        </div>
    );


});

export interface IProps {
    readonly mode: RepetitionMode;
    readonly type: StatType;
}

export interface IState {
    readonly data: ReadonlyArray<SpacedRepStat> | undefined;
}


