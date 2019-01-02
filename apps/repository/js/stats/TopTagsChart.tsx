import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {Line, Doughnut} from 'react-chartjs-2';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import * as chartjs from 'chart.js';
import {DocInfo, IDocInfo} from '../../../../web/js/metadata/DocInfo';
import { ResponsivePie } from '@nivo/pie';

const log = Logger.create();

export default class TopTagsChart extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const topTags = Statistics.computeTopTags(this.props.docInfos, 10);

        // const labels = topTags.map(current => current.key);
        // const dataPoints = topTags.map(current => current.value);

        const data = topTags.map(current => {
            return {
                id: current.key,
                label: current.key,
                value: current.value
            };
        });

        // https://github.com/jerairrest/react-chartjs-2/blob/master/example/src/components/line.js

        // const legend = {display: false};
        //
        // 3A405A
        //
        // AEC5EB
        // F9DEC9
        // E9AFA3
        // 685044

        // const data: chartjs.ChartData = {
        //     labels,
        //     datasets: [
        //         {
        //             label: 'Tag',
        //             data: dataPoints,
        //             backgroundColor: [
        //                 '#3A405A',
        //                 '#AEC5EB',
        //                 '#F9DEC9',
        //                 '#E9AFA3',
        //                 '#685044'
        //             ],
        //         },
        //
        //     ]
        //
        // };

        //
        // const data = [
        //     {
        //         "id": "lisp",
        //         "label": "lisp",
        //         "value": 435,
        //     },
        //     {
        //         "id": "sass",
        //         "label": "sass",
        //         "value": 452,
        //     },
        //     {
        //         "id": "erlang",
        //         "label": "erlang",
        //         "value": 228,
        //     },
        //     {
        //         "id": "c",
        //         "label": "c",
        //         "value": 152,
        //     },
        //     {
        //         "id": "elixir",
        //         "label": "elixir",
        //         "value": 337,
        //     }
        // ];

        console.log("FIXME: ", data);

        return (

            <div className="p-1">

                <h6 className="text-center">Top Tags</h6>

                {/*<Doughnut data={data} height={200} legend={legend}/>*/}

                <div style={{height: '600px'}}>

                    <ResponsivePie
                        data={data}
                        margin={{
                            "top": 40,
                            "right": 80,
                            "bottom": 80,
                            "left": 80
                        }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors="category10"
                        colorBy="id"
                        borderWidth={1}
                        borderColor="inherit:darker(0.2)"
                        radialLabelsSkipAngle={10}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={0}
                        radialLabelsLinkDiagonalLength={16}
                        radialLabelsLinkHorizontalLength={24}
                        radialLabelsLinkStrokeWidth={1}
                        radialLabelsLinkColor="inherit"
                        slicesLabelsSkipAngle={10}
                        slicesLabelsTextColor="#333333"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        legends={[
                            {
                                "anchor": "bottom",
                                "direction": "row",
                                "translateY": 56,
                                "itemWidth": 100,
                                "itemHeight": 18,
                                "itemTextColor": "#222",
                                "symbolSize": 18,
                                "symbolShape": "circle",
                                "effects": [
                                    {
                                        "on": "hover",
                                        "style": {
                                            "itemTextColor": "#000"
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                </div>
            </div>

        );
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}
