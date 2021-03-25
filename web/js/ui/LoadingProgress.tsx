import * as React from 'react';
import CircularProgress
    from '@material-ui/core/CircularProgress/CircularProgress';

interface IProps {
    readonly style?: React.CSSProperties;
}

export const LoadingProgress = React.memo(function LoadingProgress(props: IProps) {

    const style = props.style || {};

    return (
        <div className="mt-2 mb-2"
             style={{
                 display: 'flex',
                 flexGrow: 1,
                 opacity: 0.8,
                 ...style
             }}>

            <div className="m-auto">
                <CircularProgress style={{width: '125px', height: '125px'}}/>
            </div>

        </div>
    );
});
