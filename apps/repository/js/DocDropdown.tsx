import * as React from 'react';
import {RepoDocInfo} from './RepoDocInfo';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {DocDropdownItems} from './DocDropdownItems';

export class DocDropdown extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="doc-dropdown-parent">

                <UncontrolledDropdown id={this.props.id}
                                      size="sm">

                    <DropdownToggle color="link"
                                    className="doc-dropdown-button btn text-muted pl-1 pr-1"
                                    id={this.props.id + '-dropdown-toggle'}>

                        <i className="fas fa-ellipsis-h"/>

                    </DropdownToggle>

                    <DropdownMenu className="shadow" right>
                        <DocDropdownItems toggle={true} {...this.props}/>
                    </DropdownMenu>

                </UncontrolledDropdown>

            </div>
        );

    }

}

interface IProps {
    readonly id: string;
    readonly repoDocInfo: RepoDocInfo;
    readonly onDelete: (repoDocInfo: RepoDocInfo) => void;
    readonly onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => void;
}

interface IState {


}

