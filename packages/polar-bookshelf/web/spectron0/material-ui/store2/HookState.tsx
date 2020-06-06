import React, {useState} from 'react';

function useUpdatingState() {

    const [iter, setIter] = useState(0);

    function doTimeout() {
        console.log("doTimeout");
        setIter(Date.now());
        setTimeout(doTimeout, 1000);
    }

    if (iter === 0) {
        doTimeout();
    }

    return iter;

}

export const HookStateDemo = () => {

    const iter = useUpdatingState();

    return (
        <div>hello world: {iter}</div>
    );
}
