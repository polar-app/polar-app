import * as React from 'react';
import {prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuWrapper} from '@burtonator/react-context-menu-wrapper';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DocDropdownItems} from './DocDropdownItems';
import {RepoDocInfo} from './RepoDocInfo';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import deepEqual = require('deep-equal');

let sequence: number = 0;

export class DocContextMenu extends React.PureComponent<DocContextMenuProps> {

    // private contextMenuHandlers: ContextMenuHandlers;

    private id: string;

    constructor(props: DocContextMenuProps, context: any) {
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
}
