import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import {useAsyncWithError} from "../../../apps/repository/js/reviewer/ReviewerScreen";

export const Loading = () => (
    <div style={{
             width: '100%',
             height: '100%',
             display: 'flex',
             overflow: 'hidden'
         }}>

        <CircularProgress style={{
                               margin: 'auto',
                               width: '75px',
                               height: '75px',
                          }}/>

    </div>
);


interface IProps<T> {
    readonly provider: () => Promise<T>;
    readonly render: (props: T) => React.ReactElement;
}

export const MUIAsyncLoader = function<T>(props: IProps<T>) {
    const data = useAsyncWithError({promiseFn: props.provider});

    if (data) {
        return React.createElement(props.render, data);
    }

    return <Loading/>;
};
