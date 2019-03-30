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
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {Dialogs} from '../../../web/js/ui/dialogs/Dialogs';
import {NULL_FUNCTION} from '../../../web/js/util/Functions';
import {DocDropdownItems} from './DocDropdownItems';

const log = Logger.create();

const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

};

export class DocDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: this.open,
        };

    }

    public render() {

        return (

            <div className="doc-dropdown-parent">

                <Dropdown id={this.props.id}
                          isOpen={this.state.open}
                          toggle={this.toggle}>

                    <DropdownToggle color="link"
                                    className="doc-dropdown-button btn text-muted pl-1 pr-1"
                                    id={this.props.id + '-dropdown-toggle'}>

                        <i className="fas fa-ellipsis-h"></i>

                    </DropdownToggle>

                    <DropdownMenu className="shadow"
                                  style={Styles.DropdownMenu}>

                        <DocDropdownItems toggle={true} {...this.props}/>

                    </DropdownMenu>


                </Dropdown>

            </div>
        );

    }

    private toggle() {

        this.open = ! this.state.open;

        this.refresh();

    }

    private refresh() {

        this.setState({
            open: this.open,
        });

    }

}

interface IProps {
    readonly id: string;
    readonly repoDocInfo: RepoDocInfo;
    readonly onDelete: (repoDocInfo: RepoDocInfo) => void;
    readonly onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
}

interface IState {

    readonly open: boolean;
    readonly message?: string;

}

