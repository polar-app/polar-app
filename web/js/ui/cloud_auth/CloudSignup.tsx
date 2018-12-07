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
import {CloudSignupContent} from './CloudSignupContent';


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

                    <CloudSignupContent/>

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


