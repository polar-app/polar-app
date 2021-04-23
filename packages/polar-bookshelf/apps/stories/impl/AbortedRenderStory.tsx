import * as React from 'react';
import { AbortedRenderStoreProvider, useAbortedRenderStoreCallbacks, useAbortedRenderStore } from "./AbortedRenderStore"
import Button from '@material-ui/core/Button';

function useFilteredValue() {

    const {value} = useAbortedRenderStore(['value'], {filter: store => store.value % 2 === 0});
//
//     const [filteredValue, setFilteredValue] = React.useState(value);
//
//     console.log("useFilteredValue value: ", value);
//     console.log("useFilteredValue filteredValue: ", filteredValue);
//
//     if (value % 2 === 0 && filteredValue !== value) {
//         console.log("FIXME: setFilteredValue")
//         setFilteredValue(value);
//     }
//
//     return filteredValue;
//
// }
    return value;

}

const FilteredView = React.memo(function FilteredView() {

    const filteredValue = useFilteredValue();

    console.log("FilteredView: render");

    return (
        <div>
            {filteredValue}
        </div>
    );
});

const Inner = React.memo(function Inner() {


    const {incr} = useAbortedRenderStoreCallbacks();

    return (
        <>
            <Button onClick={incr}>incr</Button>
            <FilteredView/>
        </>
    );
});

export const AbortedRenderStory = React.memo(function AbortedRenderStory() {
    return (
        <AbortedRenderStoreProvider>
            <Inner/>
        </AbortedRenderStoreProvider>
    )
});
