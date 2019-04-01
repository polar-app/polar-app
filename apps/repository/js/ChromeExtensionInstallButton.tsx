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
import Button from 'reactstrap/lib/Button';
import {ChromeExtensionInstallation} from './ChromeExtensionInstallation';

const log = Logger.create();

export class ChromeExtensionInstallButton extends React.Component<IProps, IState> {

    private open: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onClick = this.onClick.bind(this);

        this.state = {
            open: this.open,
        };

    }

    public render() {

        return (

            <Button onClick={() => this.onClick()}
                    color="light"
                    size="sm">

                Install Chrome Extension

            </Button>

        );

    }

    private onClick(): void {

        ChromeExtensionInstallation.doInstall(() => this.onSuccess(), (error) => this.onFailure(error));

    }

    private onSuccess() {
        Toaster.success("Chrome extension installed successfully!");
    }

    private onFailure(error: string) {
        Toaster.error("Failed to install chrome extension: " + error);
    }

}

interface IProps {
}

interface IState {

}

