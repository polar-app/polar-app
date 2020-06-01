import * as React from 'react';
import { ResponsivePie } from '@nivo/pie'
import { ThemeProvider } from '@material-ui/core/styles';
import useTheme from "@material-ui/core/styles/useTheme";

const data = [
    {
        "id": "python",
        "label": "python",
        "value": 420,
        "color": "hsl(48, 70%, 50%)"
    },
    {
        "id": "php",
        "label": "php",
        "value": 499,
        "color": "hsl(194, 70%, 50%)"
    },
    {
        "id": "elixir",
        "label": "elixir",
        "value": 448,
        "color": "hsl(61, 70%, 50%)"
    },
    {
        "id": "rust",
        "label": "rust",
        "value": 259,
        "color": "hsl(233, 70%, 50%)"
    },
    {
        "id": "hack",
        "label": "hack",
        "value": 141,
        "color": "hsl(229, 70%, 50%)"
    }
];

interface IProps {
    readonly data: any;
}

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyResponsivePie = () => {

    const theme = useTheme();

    return (

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
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'c'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'go'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'python'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'scala'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'lisp'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'elixir'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'javascript'
                    },
                    id: 'lines'
                }
            ]}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    translateY: 56,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: theme.palette.text.secondary,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: theme.palette.text.secondary
                            }
                        }
                    ]
                }
            ]}
        />
    );
}
