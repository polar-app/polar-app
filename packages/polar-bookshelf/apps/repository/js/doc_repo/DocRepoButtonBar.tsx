import * as React from 'react';
import {AddContentActions} from '../ui/AddContentActions';
import {AddContent} from '../ui/AddContentButton';
import { DeviceRouters } from '../../../../web/js/ui/DeviceRouter';

export interface IProps {
}

export function DocRepoButtonBar(props: IProps) {

    return (

        <div style={{display: 'flex'}}>

            <DeviceRouters.Desktop>

                <div className="mr-1"
                     style={{
                         whiteSpace: 'nowrap',
                         marginTop: 'auto',
                         marginBottom: 'auto'
                     }}>

                    <AddContent.Desktop
                        importFromDisk={() => AddContentActions.cmdImportFromDisk()}
                        captureWebPage={() => AddContentActions.cmdCaptureWebPage()}/>

                </div>

            </DeviceRouters.Desktop>

        </div>


    );

}
