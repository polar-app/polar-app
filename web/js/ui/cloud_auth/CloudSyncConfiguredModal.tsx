import * as React from 'react';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Navbar from 'reactstrap/lib/Navbar';
import {BrowserConfigurationInputGroup} from '../../../spectron/reactstrap/BrowserConfigurationInputGroup';
import Moment from 'react-moment';
import {ListSelector, ListOptionType} from '../list_selector/ListSelector';
import {TableDropdown} from "../../../../apps/repository/js/TableDropdown";
import {SyncBar} from '../sync_bar/SyncBar';
import {IStyleMap} from '../../react/IStyleMap';
import {LargeModal} from '../large_modal/LargeModal';
import {LargeModalBody} from '../large_modal/LargeModalBody';
import {CloudSyncOverviewContent} from './CloudSyncOverviewContent';
import {CloudSyncConfiguredContent} from './CloudSyncConfiguredContent';

export class CloudSyncConfiguredModal extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Modal isOpen={this.props.isOpen} size="lg">
                {/*<ModalHeader>Polar Cloud Sync</ModalHeader>*/}
                <ModalBody>

                    <CloudSyncConfiguredContent/>

                </ModalBody>
                <ModalFooter>

                    <Button color="secondary"
                            onClick={() => this.props.onCancel()}>
                        OK
                    </Button>

                </ModalFooter>
            </Modal>

        );
    }

}

interface IProps {
    readonly isOpen: boolean;
    readonly onCancel: () => void;
}

interface IState {

}
