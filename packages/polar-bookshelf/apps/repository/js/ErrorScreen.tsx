import React from 'react';

export const ErrorScreen = () => {

    if (true === true) {
        throw new Error("This is an error");
    }

    return (
        <div>this should fail</div>
    );

}
