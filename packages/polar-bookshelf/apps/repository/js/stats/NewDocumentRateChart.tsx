import * as React from 'react';
import {DocInfoStatistics} from '../../../../web/js/metadata/DocInfoStatistics';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import StatTitle from './StatTitle';
import {ResponsiveBar} from '@nivo/bar';
import {Arrays} from "polar-shared/src/util/Arrays";
import {StatBox} from "./StatBox";

export default class NewDocumentRateChart extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const dateStats = DocInfoStatistics.computeDocumentsAddedRate(this.props.docInfos);

        const labels = dateStats.map(current => current.date);
        const ticks = Arrays.sample(labels, 10);

        const data = dateStats.map(current => {
            return {
                date: current.date,
                value: current.value
            };
        });

        return (

            <div id="new-documents-per-day-chart" className="p-1">

                <StatBox style={{height: '325px', width: '100%'}}>
                    <>
                    <StatTitle>New Documents Per Day</StatTitle>

                    <ResponsiveBar
                        data={data}
                        keys={[
                            "value",
                        ]}
                        indexBy="date"
                        margin={{
                            top: 10,
                            right: 10,
                            bottom: 50,
                            left: 40
                        }}
                        padding={0.3}
                        colors="nivo"
                        // indexBy="id"
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
                    </>
                </StatBox>

            </div>

        );
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}


