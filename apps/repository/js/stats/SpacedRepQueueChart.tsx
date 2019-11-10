import * as React from 'react';
import StatTitle from './StatTitle';
import {ResponsiveBar} from '@nivo/bar';
import {Arrays} from "polar-shared/src/util/Arrays";
import {SpacedRepStatRecord} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {Statistics} from "polar-shared/src/util/Statistics";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export class SpacedRepQueueChart extends React.Component<IProps, IState> {

    public render() {

        const datapointsReducer = (timestamp: ISODateTimeString,
                                   datapoints: ReadonlyArray<SpacedRepStatRecord>): SpacedRepStatRecord => {

            const first = datapoints[0];
            return {
                ...first,
                created: timestamp
            }
        };

        const stats = Statistics.compute(this.props.data, datapointsReducer);
        const data = [...stats];

        const labels = data.map(current => current.created);
        const ticks = Arrays.sample(labels, 10);

        return (

            <div id="new-documents-per-day-chart" className="p-1">

                <StatTitle>Reviews for {this.props.mode}</StatTitle>

                <div className="p-1" style={{height: '300px', width: '100%'}}>

                    <ResponsiveBar
                        data={data}
                        keys={[
                            "nrLearning",
                            "nrReview",
                            "nrLapsed"
                        ]}
                        indexBy="created"
                        margin={{
                            top: 10,
                            right: 10,
                            bottom: 50,
                            left: 40
                        }}
                        padding={0.3}
                        colors="category10"
                        colorBy="id"
                        defs={[
                            {
                                "id": "dots",
                                "type": "patternDots",
                                "background": "inherit",
                                "color": "#38bcb2",
                                "size": 4,
                                "padding": 1,
                                "stagger": true
                            },
                            {
                                "id": "lines",
                                "type": "patternLines",
                                "background": "inherit",
                                "color": "#eed312",
                                "rotation": -45,
                                "lineWidth": 6,
                                "spacing": 10
                            }
                        ]}
                        fill={[
                            {
                                "match": {
                                    "id": "fries"
                                },
                                "id": "dots"
                            },
                            {
                                "match": {
                                    "id": "sandwich"
                                },
                                "id": "lines"
                            }
                        ]}
                        // borderColor="inherit:darker(1.6)"
                        // axisTop=null
                        // axisRight=null
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legendOffset: 32,
                            tickValues: ticks,
                        } as any}
                        // axisLeft={{
                        //     "tickSize": 5,
                        //     "tickPadding": 5,
                        //     "tickRotation": 0,
                        //     "legend": "food",
                        //     "legendPosition": "middle",
                        //     "legendOffset": -40
                        // }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor="inherit:darker(1.6)"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}

                    />

                </div>


            </div>

        );
    }

}

export interface IProps {
    readonly mode: RepetitionMode;
    readonly data: ReadonlyArray<SpacedRepStatRecord>;
}

export interface IState {

}


