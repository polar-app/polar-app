import React from 'react';
import {useTimeInterval} from "./useTimeInterval";

const Demo = () => {

    const [interval] = useTimeInterval('1s')

    return (
        <div>
            <b>interval</b>: {interval}
        </div>
    );
}

export default {
    title: 'useTimeInterval',
    component: Demo,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};

export const Primary = <div>

</div>;

