import * as React from 'react';
import {AddContent} from '../ui/AddContentButton';
import {DeviceRouters} from '../../../../web/js/ui/DeviceRouter';

export interface IProps {
}

export function DocRepoButtonBar() {

    return (

        <div style={{display: 'flex'}}>

            <DeviceRouters.Desktop>

                <div className="mr-1"
                     style={{
                         whiteSpace: 'nowrap',
                         marginTop: 'auto',
                         marginBottom: 'auto'
                     }}>

                    <AddContent.Desktop/>

                </div>

            </DeviceRouters.Desktop>

        </div>


    );

}
