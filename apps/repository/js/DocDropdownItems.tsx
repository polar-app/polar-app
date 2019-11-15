import * as React from 'react';
import {RepoDocInfo} from './RepoDocInfo';
import {shell} from 'electron';
import {Directories} from '../../../web/js/datastore/Directories';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {Clipboards} from '../../../web/js/util/system/clipboard/Clipboards';
import {DropdownItem} from 'reactstrap';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {Dialogs} from '../../../web/js/ui/dialogs/Dialogs';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {FontAwesomeIcon} from "../../../web/js/ui/fontawesome/FontAwesomeIcon";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";
import {Filters} from "./doc_repo/DocRepoFilters";
import {Tag} from "polar-shared/src/tags/Tags";

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

        const selected = this.props.getSelected();

        if (selected.length === 0) {
            // there's nothing to render now...
            return <div/>;
        }

        // true if multiple items are selected since some actions can't work
        // on multiple items.
        const isMulti = selected.length > 1;
        const repoDocInfo = selected[0];

        const computeFolder = () => {
            const tags = this.props.filters.filteredTags.get();
            if (tags.length === 1 && tags[0].id.startsWith('/')) {
                return tags[0];
            }

            return undefined;

        };

        const folder = computeFolder();

        return (

            <div>

                <DropdownItem toggle={this.props.toggle}
                              hidden={isMulti}
                              onClick={() => this.props.onDocumentLoadRequested(repoDocInfo)}>

                    <FontAwesomeIcon name="fas fa-eye"/>

                    Open Document
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              hidden={isMulti}
                              onClick={() => this.onSetTitleRequested(repoDocInfo)}>

                    <FontAwesomeIcon name="fas fa-pencil-alt"/>
                    Rename
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              hidden={! folder}
                              onClick={() => this.props.onRemoveFromFolder(folder!, selected)}>
                    <FontAwesomeIcon name="fas fa-folder-minus"/>
                    Remove from Folder
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              hidden={! repoDocInfo.url || isMulti}
                              onClick={() => this.onCopyURL(repoDocInfo.url!)}>

                    <FontAwesomeIcon name="fas fa-external-link-alt"/>
                    Copy Original URL
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              hidden={isMulti || AppRuntime.isBrowser()}
                              disabled={! repoDocInfo.filename}
                              onClick={() => this.onShowFile(repoDocInfo.filename!)}>

                    <FontAwesomeIcon name="far fa-file"/>
                    Show File
                </DropdownItem>

                <DropdownItem hidden={isMulti} divider />

                <DropdownItem toggle={this.props.toggle}
                              disabled={! repoDocInfo.filename}
                              hidden={isMulti || AppRuntime.isBrowser()}
                              onClick={() => this.onCopyFilePath(repoDocInfo.filename!)}>

                    <FontAwesomeIcon name="far fa-clone"/>

                    Copy File Path
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              hidden={isMulti || ! FeatureToggles.get('developer')}
                              onClick={() => this.onCopyText(repoDocInfo.fingerprint, "Document ID copied to clipboard")}>
                    <FontAwesomeIcon name="far fa-clone"/>
                    Copy Document ID
                </DropdownItem>

                {/*TODO: maybe load original URL too?*/}

                <DropdownItem hidden={isMulti} divider />

                <DropdownItem toggle={this.props.toggle}
                              className="text-danger"
                              onClick={() => this.onDeleteRequested(selected)}>
                    <FontAwesomeIcon name="fas fa-trash-alt"/>
                    Delete
                </DropdownItem>

            </div>

        );

    }

    private onSetTitleRequested(repoDocInfo: RepoDocInfo) {

        Dialogs.prompt({title: "Enter a new title for the document:",
                        defaultValue: repoDocInfo.title,
                        onCancel: NULL_FUNCTION,
                        onDone: (value) => this.onSetTitle(repoDocInfo, value)});

    }

    private onDeleteRequested(repoDocInfos: ReadonlyArray<RepoDocInfo>) {
        this.onDelete(repoDocInfos);

    }

    private onDelete(repoDocInfos: ReadonlyArray<RepoDocInfo>) {
        this.props.onDelete(repoDocInfos);
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

    private onSetTitle(repoDocInfo: RepoDocInfo, title: string) {
        this.props.onSetTitle(repoDocInfo, title);
    }

}

export interface OnRemoveFromFolderCallback {
    (folder: Tag, repoDocInfos: ReadonlyArray<RepoDocInfo>): void;
}

interface IProps {
    readonly filters: Filters;
    readonly getSelected: () => ReadonlyArray<RepoDocInfo>;
    readonly toggle: boolean;
    readonly onDelete: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => void;
    readonly onRemoveFromFolder: OnRemoveFromFolderCallback;
}

interface IState {

}

