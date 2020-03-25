import * as React from 'react';
import {OnRemoveFromFolderCallback} from './DocDropdownItems';
import {RepoDocInfo} from './RepoDocInfo';
import {Filters} from "./doc_repo/DocRepoFilters";

let sequence: number = 0;

export class DocContextMenu extends React.PureComponent<IProps> {

    // private contextMenuHandlers: ContextMenuHandlers;

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.id = 'doc-context-menu2-' + sequence++;

        // this.contextMenuHandlers = prepareContextMenuHandlers({id: this.id});

    }

    public render() {

        return (

            <div>

                {/*<div {...this.contextMenuHandlers}>*/}
                {/*    {this.props.children}*/}
                {/*</div>*/}

                <div>
                    {this.props.children}
                </div>

                {/*<ContextMenuWrapper id={this.id}>*/}

                {/*    <div className="border shadow rounded pt-2 pb-2"*/}
                {/*         style={{backgroundColor: 'var(--white)'}}>*/}

                {/*        <DocDropdownItems toggle={false}*/}
                {/*                          getSelected={this.props.getSelected}*/}
                {/*                          onDelete={this.props.onDelete}*/}
                {/*                          onSetTitle={this.props.onSetTitle}*/}
                {/*                          onDocumentLoadRequested={this.props.onDocumentLoadRequested}/>*/}

                {/*    </div>*/}

                {/*</ContextMenuWrapper>*/}

            </div>

        );

    }

}

export interface DocContextMenuProps {
    readonly getSelected: () => ReadonlyArray<RepoDocInfo>;
    readonly onDelete: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => void;
    readonly onRemoveFromFolder: OnRemoveFromFolderCallback;
}

export interface IProps extends DocContextMenuProps {
    readonly filters: Filters;
}
