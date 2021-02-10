import React from 'react';
import Button from "@material-ui/core/Button";

export const CachedComponent = React.memo(() => {
    console.log("FIXME rendered");

    return <div>this is cached</div>
})

export const ComponentCacheDemo = () => {

    const [iter, setIter] = React.useState(0);

    return (
        <div>
            <CachedComponent/>
            <CachedComponent/>
            <CachedComponent/>
            <CachedComponent/>

            iter: {iter}

            <Button variant="contained"
                    onClick={() => setIter(iter + 1)}>click
                me
            </Button>

        </div>
    );
}
