import React from 'react';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {deepMemo} from "../react/ReactUtils";

interface IProps extends CircularProgressProps {
    readonly value: number;
}

export const CircularProgressWithLabel = deepMemo(function CircularProgressWithLabel(props: IProps) {

    const rounded = Math.round(props.value);
    const text = `${rounded}%`;

    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="static" {...props} />
            <Box top={0}
                 left={0}
                 bottom={0}
                 right={0}
                 position="absolute"
                 display="flex"
                 alignItems="center"
                 justifyContent="center">

                 <Typography variant="caption"
                             component="div"
                             color="textSecondary">
                     {text}
                 </Typography>

            </Box>
        </Box>
    );
});
