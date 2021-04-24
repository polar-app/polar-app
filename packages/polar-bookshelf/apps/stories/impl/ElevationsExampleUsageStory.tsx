import * as React from 'react';
import {MUIElevation} from "../../../web/js/mui/MUIElevation";

const MockElevationComponent = () => {
    return (
        <div style={{display: 'flex', flexGrow: 1}}>

            <MUIElevation elevation={1}>
                <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1
                     }}>

                    <div>
                        sidebar with elevation 0
                    </div>

                </div>
            </MUIElevation>

            <MUIElevation elevation={0} style={{flexGrow: 1}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                }}>

                    <div>
                        main content with elevation 0
                    </div>

                </div>
            </MUIElevation>

        </div>

    );
}


export const ElevationsStory = () => {

    return (
        <MockElevationComponent/>
    )

}
