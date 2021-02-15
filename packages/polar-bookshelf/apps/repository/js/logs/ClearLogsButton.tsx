import * as React from 'react';
import Button from '@material-ui/core/Button';
import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";

export const ClearLogsButton = () => {

    const onClick = () => {
        ConsoleRecorder.clear();
    }

    return (
        <Button variant="contained"
                onClick={() => onClick()}>
            Clear
        </Button>
    );

}
