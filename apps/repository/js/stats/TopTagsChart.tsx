import * as React from 'react';
import {DocInfoStatistics} from '../../../../web/js/metadata/DocInfoStatistics';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {ResponsivePie} from '@nivo/pie';
import StatTitle from './StatTitle';
import useTheme from '@material-ui/core/styles/useTheme';

export default function TopTagsChart(props: IProps) {

    const theme = useTheme();

    const topTags = DocInfoStatistics.computeTopTags(props.docInfos, 10);

    const data = topTags.map(current => {
        return {
            id: current.key,
            label: current.key,
            value: current.value
        };
    });

    return (

        <div id="top-tags-chart" className="p-1">

            <StatTitle>Top Tags</StatTitle>

            <div style={{height: '600px', width: '100%'}}>

                {/*<ResponsivePie*/}
                {/*    data={data}*/}
                {/*    margin={{*/}
                {/*        "top": 40,*/}
                {/*        "right": 80,*/}
                {/*        "bottom": 80,*/}
                {/*        "left": 80*/}
                {/*    }}*/}
                {/*    innerRadius={0.5}*/}
                {/*    padAngle={0.7}*/}
                {/*    cornerRadius={3}*/}
                {/*    colors="nivo"*/}
                {/*    // colorBy="id"*/}
                {/*    borderWidth={1}*/}
                {/*    borderColor="inherit:darker(0.2)"*/}
                {/*    radialLabelsSkipAngle={10}*/}
                {/*    radialLabelsTextXOffset={6}*/}
                {/*    radialLabelsTextColor="#333333"*/}
                {/*    radialLabelsLinkOffset={0}*/}
                {/*    radialLabelsLinkDiagonalLength={16}*/}
                {/*    radialLabelsLinkHorizontalLength={24}*/}
                {/*    radialLabelsLinkStrokeWidth={1}*/}
                {/*    radialLabelsLinkColor="inherit"*/}
                {/*    slicesLabelsSkipAngle={10}*/}
                {/*    slicesLabelsTextColor="#333333"*/}
                {/*    animate={true}*/}
                {/*    motionStiffness={90}*/}
                {/*    motionDamping={15}*/}

                {/*/>*/}

                <ResponsivePie
                    data={data}
                    margin={{top: 40, right: 80, bottom: 80, left: 80}}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{scheme: 'nivo'}}
                    borderWidth={1}
                    borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor={theme.palette.text.secondary}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor={{from: 'color'}}
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor={theme.palette.text.secondary}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    // legends={[
                    //     {
                    //         anchor: 'bottom',
                    //         direction: 'row',
                    //         translateY: 56,
                    //         itemWidth: 100,
                    //         itemHeight: 18,
                    //         itemTextColor: theme.palette.text.secondary,
                    //         symbolSize: 18,
                    //         symbolShape: 'circle',
                    //         effects: [
                    //             {
                    //                 on: 'hover',
                    //                 style: {
                    //                     itemTextColor: theme.palette.text.secondary
                    //                 }
                    //             }
                    //         ]
                    //     }
                    // ]}
                />

            </div>
        </div>

    );
}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}

