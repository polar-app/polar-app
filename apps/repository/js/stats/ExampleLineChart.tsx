import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {Line, Doughnut} from 'react-chartjs-2';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import * as chartjs from 'chart.js';
import {DocInfo, IDocInfo} from '../../../../web/js/metadata/DocInfo';
import { ResponsiveLine, LineSerieData } from '@nivo/line';

const log = Logger.create();

export default class ExampleLineChart extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const data: LineSerieData[] = [
            {
                "id": "japan",
                "color": "hsl(182, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 27
                    },
                    {
                        "x": "helicopter",
                        "y": 84
                    },
                    {
                        "x": "boat",
                        "y": 27
                    },
                    {
                        "x": "train",
                        "y": 291
                    },
                    {
                        "x": "subway",
                        "y": 38
                    },
                    {
                        "x": "bus",
                        "y": 262
                    },
                    {
                        "x": "car",
                        "y": 82
                    },
                    {
                        "x": "moto",
                        "y": 84
                    },
                    {
                        "x": "bicycle",
                        "y": 95
                    },
                    {
                        "x": "others",
                        "y": 176
                    }
                ]
            },
            {
                "id": "france",
                "color": "hsl(235, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 173
                    },
                    {
                        "x": "helicopter",
                        "y": 16
                    },
                    {
                        "x": "boat",
                        "y": 297
                    },
                    {
                        "x": "train",
                        "y": 175
                    },
                    {
                        "x": "subway",
                        "y": 247
                    },
                    {
                        "x": "bus",
                        "y": 52
                    },
                    {
                        "x": "car",
                        "y": 22
                    },
                    {
                        "x": "moto",
                        "y": 296
                    },
                    {
                        "x": "bicycle",
                        "y": 120
                    },
                    {
                        "x": "others",
                        "y": 261
                    }
                ]
            },
            {
                "id": "us",
                "color": "hsl(114, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 122
                    },
                    {
                        "x": "helicopter",
                        "y": 183
                    },
                    {
                        "x": "boat",
                        "y": 171
                    },
                    {
                        "x": "train",
                        "y": 98
                    },
                    {
                        "x": "subway",
                        "y": 125
                    },
                    {
                        "x": "bus",
                        "y": 263
                    },
                    {
                        "x": "car",
                        "y": 49
                    },
                    {
                        "x": "moto",
                        "y": 39
                    },
                    {
                        "x": "bicycle",
                        "y": 160
                    },
                    {
                        "x": "others",
                        "y": 231
                    }
                ]
            },
            {
                "id": "germany",
                "color": "hsl(83, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 88
                    },
                    {
                        "x": "helicopter",
                        "y": 275
                    },
                    {
                        "x": "boat",
                        "y": 63
                    },
                    {
                        "x": "train",
                        "y": 208
                    },
                    {
                        "x": "subway",
                        "y": 284
                    },
                    {
                        "x": "bus",
                        "y": 25
                    },
                    {
                        "x": "car",
                        "y": 71
                    },
                    {
                        "x": "moto",
                        "y": 222
                    },
                    {
                        "x": "bicycle",
                        "y": 31
                    },
                    {
                        "x": "others",
                        "y": 120
                    }
                ]
            },
            {
                "id": "norway",
                "color": "hsl(334, 70%, 50%)",
                "data": [
                    {
                        "x": "plane",
                        "y": 198
                    },
                    {
                        "x": "helicopter",
                        "y": 238
                    },
                    {
                        "x": "boat",
                        "y": 121
                    },
                    {
                        "x": "train",
                        "y": 1
                    },
                    {
                        "x": "subway",
                        "y": 159
                    },
                    {
                        "x": "bus",
                        "y": 171
                    },
                    {
                        "x": "car",
                        "y": 258
                    },
                    {
                        "x": "moto",
                        "y": 246
                    },
                    {
                        "x": "bicycle",
                        "y": 165
                    },
                    {
                        "x": "others",
                        "y": 279
                    }
                ]
            }
        ];

        return (

            <div className="p-1 App" style={{height: '200px'}}>


                <ResponsiveLine
                    data={data}
                    margin={{
                        "top": 50,
                        "right": 110,
                        "bottom": 50,
                        "left": 60
                    }}
                    xScale={{
                        "type": "point"
                    }}
                    yScale={{
                        "type": "linear",
                        "stacked": true,
                        "min": "auto",
                        "max": "auto"
                    }}
                    axisTop={undefined}
                    axisRight={undefined}
                    axisBottom={{
                        // FIXME: "orient": "bottom",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": "transportation",
                        "legendOffset": 36,
                        "legendPosition": "middle"
                    }}
                    axisLeft={{
                        // FIXME: "orient": "left",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": "count",
                        "legendOffset": -40,
                        "legendPosition": "middle"
                    }}
                    dotSize={10}
                    dotColor="inherit:darker(0.3)"
                    dotBorderWidth={2}
                    dotBorderColor="#ffffff"
                    enableDotLabel={true}
                    // FIXME: dotLabel="y"
                    // FIXME: dotLabelYOffset={-12}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            "anchor": "bottom-right",
                            "direction": "column",
                            "justify": false,
                            "translateX": 100,
                            "translateY": 0,
                            "itemsSpacing": 0,
                            "itemDirection": "left-to-right",
                            "itemWidth": 80,
                            "itemHeight": 20,
                            "itemOpacity": 0.75,
                            "symbolSize": 12,
                            "symbolShape": "circle",
                            // FIXME: "symbolBorderColor": "rgba(0, 0, 0, .5)",
                            "effects": [
                                {
                                    "on": "hover",
                                    "style": {
                                        "itemBackground": "rgba(0, 0, 0, .03)",
                                        "itemOpacity": 1
                                    }
                                }
                            ]
                        }
                    ]}
                />

            </div>

        );
    }

}

export interface IProps {
}

export interface IState {

}
