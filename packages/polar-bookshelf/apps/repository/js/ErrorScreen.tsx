import React from 'react';

export const ErrorScreen = () => {

    React.useEffect(() => {
        console.error("Something bad happened", new Error("Something bad (test)!"))
    })

    if (true === true) {
        throw new Error("This is an error");
    }

    return (
        <div>this should fail</div>
    );

}
