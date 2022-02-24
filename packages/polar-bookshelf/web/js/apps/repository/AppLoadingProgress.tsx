import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import {PolarLogoImage} from "../../../../apps/repository/js/nav/PolarLogoImage";

/**
 * Should be used while the app is loading as the main progress loading component.
 */
export const AppLoadingProgress = React.memo(function AppLoadingProgress() {

    return (
        <div data-test="AppLoadingProgress"
             style={{display: 'flex', height: '100%', flexGrow: 1, flexDirection: 'column'}}>

            <LinearProgress/>

            <div style={{
                     flexGrow: 1,
                     display: 'flex',
                     // textAlign: 'center',
                     justifyContent: 'center',
                     alignItems: 'center'
                 }}>

                <PolarLogoImage height={250} width={250}/>

            </div>

        </div>
    );

});
