import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {ToggleButton} from '../../../../web/js/ui/ToggleButton';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {FilterTagInput} from '../FilterTagInput';
import {TagsDB} from '../TagsDB';
import {FilteredTags} from '../FilteredTags';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';
import {AddContentButton} from '../ui/AddContentButton';
import {AddContentActions} from '../ui/AddContentActions';
import {TagButton} from './TagButton';
import {MultiDeleteButton} from './multi_buttons/MultiDeleteButton';
import {Tag} from '../../../../web/js/tags/Tag';

const log = Logger.create();

export class DocRepoButtonBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {


        return (

            <div style={{display: 'flex'}}>

                <div className="mr-1"
                     style={{
                         whiteSpace: 'nowrap',
                         marginTop: 'auto',
                         marginBottom: 'auto'
                     }}>

                    <AddContentButton importFromDisk={() => AddContentActions.cmdImportFromDisk()}
                                      captureWebPage={() => AddContentActions.cmdCaptureWebPage()}/>

                </div>

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
