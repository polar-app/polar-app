import {Theme} from '@nivo/core';

import useTheme from "@material-ui/core/styles/useTheme";

export function useNivoTheme(): Theme {

    const theme = useTheme();

    return {
        // TODO: the key property we need to make the legend
        // white is 'fill' and we should clean this up so it is just
        // the minimum we need
        markers: {
            textColor: theme.palette.text.primary
        },
        axis: {
            legend: {
                text: {
                    fill: theme.palette.text.primary,
                    color: theme.palette.text.primary
                }
            },
            ticks: {
                text: {
                    fill: theme.palette.text.primary,
                    color: theme.palette.text.primary
                }
            }
        },
        dots: {
            text: {
                fill: theme.palette.text.primary,
                color: theme.palette.text.primary
            }
        },
        legends: {
            text: {
                fill: theme.palette.text.primary,
                color: theme.palette.text.primary
            }
        },
        labels: {
            text: {
                fill: theme.palette.text.primary,
                color: theme.palette.text.primary
            }
        },
        tooltip: {
            container: {
                background: theme.palette.text.primary,
                color: theme.palette.background.default
            }
        }
    }
}
