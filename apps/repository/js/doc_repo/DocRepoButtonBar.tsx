import * as React from 'react';
import {AddContentActions} from '../ui/AddContentActions';
import {Tag} from 'polar-shared/src/tags/Tags';
import {DeviceRouter} from '../../../../web/js/ui/DeviceRouter';
import {AddContent} from '../ui/AddContentButton';

export interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

export function DocRepoButtonBar(pros: IProps) {

    return (

        <div style={{display: 'flex'}}>

            <DeviceRouter.Desktop>

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

            </DeviceRouter.Desktop>

        </div>


    );

}
