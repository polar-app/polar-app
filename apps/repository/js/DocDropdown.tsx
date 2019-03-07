import * as React from 'react';
import {ConfirmPopover} from '../../../web/js/ui/confirm/ConfirmPopover';
import {TextInputPopover} from '../../../web/js/ui/text_input/TextInputPopover';
import {RepoDocInfo} from './RepoDocInfo';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {clipboard, shell} from 'electron';
import {Directories} from '../../../web/js/datastore/Directories';
import {FilePaths} from '../../../web/js/util/FilePaths';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {Clipboards} from '../../../web/js/util/system/clipboard/Clipboards';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';

const log = Logger.create();

const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

};

export class DocDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;
    private selected: SelectedOption = 'none';

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSetTitle = this.onSetTitle.bind(this);
        this.onCopyURL = this.onCopyURL.bind(this);

        this.state = {
            open: this.open,
            selected: this.selected,
        };

    }

    public render() {

        return (

            <div className="doc-dropdown-parent">

                {/*TODO: I experimented with bringing up a tooltip after the user*/}
                {/*selects an item but there's no way to auto-hide after it was */}
                {/*selected with a display.  I might be able to implement one*/}
                {/*that auto-hides itself with componentWillReceiveProps and then */}
                {/*give it a message and then show and then hide the tooltip after */}
                {/*this event but this will take a while.*/}
                {/*<Tooltip placement="left"*/}
                         {/*isOpen={this.state.open && this.state.message !== undefined}*/}
                         {/*autohide={true}*/}
                         {/*hide={4000}*/}
                         {/*target={this.props.id}>*/}
                    {/*Hello world!*/}
                {/*</Tooltip>*/}

                <Dropdown id={this.props.id} isOpen={this.state.open} toggle={this.toggle}>

                    <DropdownToggle color="link"
                                    className="doc-dropdown-button btn text-muted pl-1 pr-1"
                                    id={this.props.id + '-dropdown-toggle'}>

                        <i className="fas fa-ellipsis-h"></i>

                    </DropdownToggle>

                    <DropdownMenu style={Styles.DropdownMenu}>

                        <DropdownItem onClick={() => this.select('set-title')}>
                            Set Title
                        </DropdownItem>

                        <DropdownItem disabled={! this.props.repoDocInfo.url}
                                      onClick={() => this.onCopyURL(this.props.repoDocInfo.url!)}>
                            Copy Original URL
                        </DropdownItem>

                        <DropdownItem disabled={! this.props.repoDocInfo.filename}
                                      onClick={() => this.onShowFile(this.props.repoDocInfo.filename!)}>
                            Show File
                        </DropdownItem>

                        <DropdownItem disabled={! this.props.repoDocInfo.filename}
                                      onClick={() => this.onCopyFilePath(this.props.repoDocInfo.filename!)}>
                            Copy File Path
                        </DropdownItem>

                        <DropdownItem disabled={! this.props.repoDocInfo.filename}
                                      onClick={() => this.onCopyText(this.props.repoDocInfo.fingerprint, "Document ID copied to clipboard")}>
                            Copy Document ID
                        </DropdownItem>

                        {/*TODO: maybe load original URL too?*/}

                        <DropdownItem divider />

                        <DropdownItem className="text-danger" onClick={() => this.select('delete')}>
                            Delete
                        </DropdownItem>

                    </DropdownMenu>


                </Dropdown>

                <TextInputPopover open={this.state.selected === 'set-title'}
                                  target={this.props.id + '-dropdown-toggle'}
                                  title="Enter title for document:"
                                  defaultValue={this.props.repoDocInfo.title}
                                  onCancel={() => this.select('none')}
                                  onComplete={this.onSetTitle}/>

                <ConfirmPopover open={this.state.selected === 'delete'}
                                target={this.props.id + '-dropdown-toggle'}
                                title="Are you sure you want to delete this document? "
                                subtitle="The document and all annotations will be lost."
                                onCancel={() => this.select('none')}
                                onConfirm={this.onDelete}/>

            </div>
        );

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
        this.select('none');
        this.props.onSetTitle(this.props.repoDocInfo, title);
    }

    private onDelete() {
        this.select('none');
        this.props.onDelete(this.props.repoDocInfo);
    }


    private toggle() {

        if (this.selected !== 'none') {
            this.open = false;
        } else {
            this.open = ! this.state.open;
        }

        this.refresh();

    }

    private select(selected: SelectedOption) {
        this.selected = selected;
        this.refresh();
    }

    private refresh() {

        this.setState({
            open: this.open,
            selected: this.selected
        });

    }

}

interface IProps {
    id: string;
    repoDocInfo: RepoDocInfo;
    onDelete: (repoDocInfo: RepoDocInfo) => void;
    onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
}

interface IState {

    open: boolean;
    selected: SelectedOption;
    message?: string;

}

type SelectedOption = 'set-title' | 'delete' | 'none';

