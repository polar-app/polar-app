import * as React from 'react';
import {RepoDocInfo} from './RepoDocInfo';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {shell} from 'electron';
import {Directories} from '../../../web/js/datastore/Directories';
import {FilePaths} from '../../../web/js/util/FilePaths';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {Clipboards} from '../../../web/js/util/system/clipboard/Clipboards';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {Dialogs} from '../../../web/js/ui/dialogs/Dialogs';
import {NULL_FUNCTION} from '../../../web/js/util/Functions';

const log = Logger.create();

const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

};

export class DocDropdownItems extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.onSetTitle = this.onSetTitle.bind(this);
        this.onCopyURL = this.onCopyURL.bind(this);

        this.onDeleteRequested = this.onDeleteRequested.bind(this);
        this.onSetTitleRequested = this.onSetTitleRequested.bind(this);

    }

    public render() {

        return (

            <div>
                <DropdownItem onClick={() => this.onSetTitleRequested()}>
                    Set Title
                </DropdownItem>

                <DropdownItem disabled={! this.props.repoDocInfo.url}
                              onClick={() => this.onCopyURL(this.props.repoDocInfo.url!)}>
                    Copy Original URL
                </DropdownItem>

                <DropdownItem disabled={! this.props.repoDocInfo.filename}
                              hidden={AppRuntime.isBrowser()}
                              onClick={() => this.onShowFile(this.props.repoDocInfo.filename!)}>
                    Show File
                </DropdownItem>

                <DropdownItem disabled={! this.props.repoDocInfo.filename}
                              hidden={AppRuntime.isBrowser()}
                              onClick={() => this.onCopyFilePath(this.props.repoDocInfo.filename!)}>
                    Copy File Path
                </DropdownItem>

                <DropdownItem disabled={! this.props.repoDocInfo.filename}
                              onClick={() => this.onCopyText(this.props.repoDocInfo.fingerprint, "Document ID copied to clipboard")}>
                    Copy Document ID
                </DropdownItem>

                {/*TODO: maybe load original URL too?*/}

                <DropdownItem divider />

                <DropdownItem className="text-danger" onClick={() => this.onDeleteRequested()}>
                    Delete
                </DropdownItem>

            </div>

        );

    }

    private onSetTitleRequested() {

        Dialogs.prompt({title: "Enter a new title for the docucment:",
                        defaultValue: this.props.repoDocInfo.title,
                        onCancel: NULL_FUNCTION,
                        onDone: (value) => this.onSetTitle(value)});

    }

    private onDeleteRequested() {

        Dialogs.confirm({title: "Are you sure you want to delete this document? ",
                         subtitle: "The document and all annotations will be lost.",
                         onCancel: NULL_FUNCTION,
                         onConfirm: () => this.onDelete()});
    }

    private onDelete() {
        this.props.onDelete(this.props.repoDocInfo);
    }

    private onShowFile(filename: string) {

        const directories = new Directories();
        const path = FilePaths.join(directories.stashDir, filename);
        shell.showItemInFolder(path);
    }

    private onCopyFilePath(filename: string) {

        const directories = new Directories();
        const path = FilePaths.join(directories.stashDir, filename);

        this.copyText(path);
        Toaster.success("File path copied to clipboard!");

    }

    private onCopyText(text: string, message: string) {
        this.copyText(text);
        Toaster.success(message);
    }

    private onCopyURL(url: string) {
        this.copyText(url);
        Toaster.success("URL copied to clipboard!");
    }

    private copyText(text: string) {
        Clipboards.getInstance().writeText(text);
    }

    private onSetTitle(title: string) {
        this.props.onSetTitle(this.props.repoDocInfo, title);
    }

}

interface IProps {
    id: string;
    repoDocInfo: RepoDocInfo;
    onDelete: (repoDocInfo: RepoDocInfo) => void;
    onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
}

interface IState {

}

