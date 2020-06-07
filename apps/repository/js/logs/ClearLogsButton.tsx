import * as React from 'react';
import {MemoryLogger} from '../../../../web/js/logger/MemoryLogger';
import Button from '@material-ui/core/Button';


export default class ClearLogsButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <Button variant="contained"
                    onClick={() => this.onClick()}>
                Clear
            </Button>
        );

    }

    private onClick() {
        MemoryLogger.clear();
    }

}



export interface IProps {

}

export interface IState {

}
