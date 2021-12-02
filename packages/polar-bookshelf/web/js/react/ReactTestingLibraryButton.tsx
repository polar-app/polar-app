import React from 'react';
import Button from "@material-ui/core/Button";

/**
 * Fake component that we don't use in production just so that we can test RTL
 */
export const ReactTestingLibraryButton = () => {

    const [clicked, setClicked] = React.useState(false)

    return (
        <>
            {clicked && (
                <p>
                    The user clicked the button!
                </p>
            )}
            <Button variant="contained" onClick={() => setClicked(true)}>
                Click Me
            </Button>
        </>
    )

}
