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


const Styles: IStyleMap = {

    button: {
        paddingTop: '4px',
        color: 'red !important',
        fontSize: '15px'

        // minWidth: '350px',
        // width: '350px'
    },

    icon: {
        fontSize: '120px',
        margin: '20px',
        color: '007bff'
        // minWidth: '350px',
        // width: '350px'
    },

    overview: {
        fontSize: '18px',
        textAlign: 'justify',
        margin: '25px'
    },

    features: {
        marginLeft: '25px'
    },

    price: {
        textAlign: 'center',
    },

    price_value: {
        fontSize: '40px',
        fontWeight: 'bold',
        lineHeight: '1em',
    },

    price_overview: {
        fontSize: '14px',
    }

};

export class CloudSignup extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <LargeModal isOpen={this.props.isOpen}>
                {/*<ModalHeader>Polar Cloud Sync</ModalHeader>*/}
                <LargeModalBody>

                    <div className="text-center">

                        <i className="fas fa-cloud-upload-alt" style={Styles.icon}></i>

                        <h1>Polar Cloud Sync</h1>

                    </div>

                    <p className="intro" style={Styles.overview}>
                        Polar Cloud Sync enables synchronization of your
                        documents and annotations between multiple
                        devices transparently with the cloud.
                    </p>

                    <ul style={Styles.features}>

                        <li>
                            Full sync of your data into the cloud in realtime.
                            Your files are immediately distributed to your other
                            devices (MacOS, Windows, and Linux)
                        </li>

                        <li>
                            10 GB of storage for all you documents and
                            annotations.
                        </li>

                        <li>
                            Private access control. Your data is private
                            and only accessible to your account.
                        </li>

                        <li>
                            Full offline access with cloud sync upon reconnect.
                        </li>

                    </ul>

                    <p style={Styles.price}>

                        <div style={Styles.price_value}>
                            $7.99
                        </div>

                        <div className="text-muted" style={Styles.price_overview}>
                            per month
                        </div>

                    </p>

                </LargeModalBody>
                <ModalFooter>

                    <Button color="secondary"
                            onClick={() => this.props.onCancel()}>
                        Cancel
                    </Button>

                    <Button color="primary"
                            onClick={() => this.props.onSignup()}>
                        Sign Up
                    </Button>{' '}

                </ModalFooter>
            </LargeModal>

        );
    }

}

interface IProps {
    readonly isOpen: boolean;
    readonly onCancel: () => void;
    readonly onSignup: () => void;
}

interface IState {

}


