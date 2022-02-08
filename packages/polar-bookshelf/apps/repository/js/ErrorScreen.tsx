import React from 'react';
import {MUIAppRoot} from "../../../web/js/mui/MUIAppRoot";

export const ErrorScreen = () => {

    React.useEffect(() => {
        console.error("Something bad happened", new Error("Something bad (test)!"))
    })

    if (true === true) {
        throw new Error("This is an error");
    }

    return (
        <MUIAppRoot useRedesign={false} darkMode={true}>
            <div>this should fail</div>
        </MUIAppRoot>
    );

}
