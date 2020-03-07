import * as React from 'react';
import {AddContentActions} from '../ui/AddContentActions';
import {TagButton} from './TagButton';
import {MultiDeleteButton} from './multi_buttons/MultiDeleteButton';
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

                <div className="mr-1"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div style={{display: 'flex'}}>

                        <div>

                            <TagButton id="tag-multiple-documents"
                                       disabled={! this.props.hasSelected}
                                       tagsProvider={this.props.tagsProvider}
                                       onSelectedTags={this.props.onMultiTagged}/>

                        </div>

                        <div className="ml-1">
                            <MultiDeleteButton disabled={! this.props.hasSelected}
                                               onClick={() => this.props.onMultiDeleted()}/>
                        </div>

                    </div>

                </div>

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
