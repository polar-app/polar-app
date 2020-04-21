import * as React from 'react';
import {AddContentActions} from '../ui/AddContentActions';
import {Tag} from 'polar-shared/src/tags/Tags';
import {DeviceRouter} from '../../../../web/js/ui/DeviceRouter';
import {AddContent} from '../ui/AddContentButton';

export class DocRepoButtonBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {


        return (

            <div style={{display: 'flex'}}>

                <DeviceRouter.Desktop>

                    <div className="mr-1"
                         style={{
                             whiteSpace: 'nowrap',
                             marginTop: 'auto',
                             marginBottom: 'auto'
                         }}>

                        <AddContent.Desktop importFromDisk={() => AddContentActions.cmdImportFromDisk()}
                                            captureWebPage={() => AddContentActions.cmdCaptureWebPage()}/>

                    </div>

                </DeviceRouter.Desktop>

            </div>


        );

    }



}

export interface IProps {
    readonly hasSelected: boolean;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly onMultiTagged: (tags: ReadonlyArray<Tag>) => void;
    readonly onMultiDeleted: () => void;
}

interface IState {

}
