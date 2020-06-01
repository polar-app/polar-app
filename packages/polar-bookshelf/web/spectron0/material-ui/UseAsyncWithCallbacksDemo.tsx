import {useAsync} from "react-async";
import React from "react";

async function doAsync() {
    return "hello world";
}

export const UseAsyncWithCallbacksDemo = () => {

    const [data, setData] = React.useState("none");

    const handleCallback = React.useCallback(() => {
        const {data, error} = useAsync({promiseFn: doAsync})

        if (data) {
            setData(data);
        }

    }, []);

    return (
        <div onClick={handleCallback}>
            {data}
        </div>
    );

}
