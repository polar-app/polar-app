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
import {BrowserConfigurationInputGroup} from './BrowserConfigurationInputGroup';
import Moment from 'react-moment';
import {ListSelector, ListOptionType} from '../../js/ui/list_selector/ListSelector';
import {TableDropdown} from "../../../apps/repository/js/TableDropdown";
import {SyncBar} from '../../js/ui/sync_bar/SyncBar';
import {IStyleMap} from '../../js/react/IStyleMap';


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


            <div>

                    <Modal isOpen={true}>
                        {/*<ModalHeader>Polar Cloud Sync</ModalHeader>*/}
                        <ModalBody>

                            <div className="text-center">

                                <i className="fas fa-cloud-upload-alt" style={Styles.icon}></i>

                                <h1>Polar Cloud Sync</h1>

                            </div>

                            <p className="intro" style={Styles.overview}>
                                Polar Cloud Sync enables synchronization of your
                                documents and annotations between mulitple
                                devices transparently with the cloud.
                            </p>

                            <ul style={Styles.features}>

                                <li>Full sync of your data into the cloud in
                                realtime.  Your files are immediately
                                distributed to your other devices.</li>

                                <li>10 GB of storage for all you documents and
                                annotations.</li>

                                <li>Private access control. Your data is private
                                and only accessible to your account.</li>

                                <li>Full offline access with cloud sync upon
                                    reconnect.</li>

                            </ul>

                            <p style={Styles.price}>

                                <div style={Styles.price_value}>
                                    $7.99
                                </div>

                                <div className="text-muted" style={Styles.price_overview}>
                                    per month
                                </div>

                            </p>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary">Sign Up</Button>{' '}
                            <Button color="secondary">Cancel</Button>
                        </ModalFooter>
                    </Modal>

            </div>
        );
    }

}

interface IProps {

}

interface IState {

}


