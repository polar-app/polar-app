import * as React from 'react';
import {RepoDocInfo} from './RepoDocInfo';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {DocDropdownItems, OnRemoveFromFolderCallback} from './DocDropdownItems';
import {Filters} from "./doc_repo/DocRepoFilters";

/**
 * @Deprecated MUI
 */
export class DocDropdown extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="doc-dropdown-parent">

                <UncontrolledDropdown id={this.props.id}
                                      size="md">

                    <DropdownToggle color="link"
                                    className="doc-dropdown-button btn text-muted pl-1 pr-1"
                                    id={this.props.id + '-dropdown-toggle'}>

                        <i className="fas fa-ellipsis-h"/>

                    </DropdownToggle>

                    <DropdownMenu className="shadow" right>
                        <DocDropdownItems toggle={true}
                                          filters={this.props.filters}
                                          getSelected={this.props.getSelected}
                                          onDelete={this.props.onDelete}
                                          onSetTitle={this.props.onSetTitle}
                                          onDocumentLoadRequested={this.props.onDocumentLoadRequested}
                                          onRemoveFromFolder={this.props.onRemoveFromFolder}/>
                    </DropdownMenu>

                </UncontrolledDropdown>

            </div>
        );

    }

}

interface IProps {
    readonly id: string;
    readonly filters: Filters;
    readonly getSelected: () => ReadonlyArray<RepoDocInfo>;
    readonly onDelete: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => void;
    readonly onRemoveFromFolder: OnRemoveFromFolderCallback;
}

interface IState {


}
