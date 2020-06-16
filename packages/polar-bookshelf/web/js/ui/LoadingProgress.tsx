import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

export class LoadingProgress extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <div className="mt-2 mb-2"
                 style={{
                     display: 'flex',
                     color: 'var(--primary)',
                     opacity: 0.8
                 }}>

                <div className="m-auto">
                    <CircularProgress style={{width: '125px', height: '125px'}}/>
                </div>

            </div>
        );
    }

}

export interface IProps {
}

export interface IState {
}
