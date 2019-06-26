import React from 'react';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Popover} from 'reactstrap';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {NotificationForPrivateGroupDoc} from './NotificationForPrivateGroupDoc';
import {NullCollapse} from '../null_collapse/NullCollapse';
import {DropdownChevron} from '../util/DropdownChevron';

const NotificationList = (props: IProps) => {

    const invitations = props.invitations || [];

    return <ul>
        {invitations.map(invitation =>
            <NotificationForPrivateGroupDoc key={invitation.id}
                                            invitation={invitation}
                                            persistenceLayerProvider={props.persistenceLayerProvider}/>)}
    </ul>;

};

export class NotificationButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false,
        };

    }

    public render() {

        const invitations = this.props.invitations || [];
        const count = invitations.length;

        return (

            <div className="">

                <Button color="primary"
                        id="notification-button"
                        size="sm"
                        onClick={() => this.toggle(true)}
                        // style={{fontSize: '15px'}}
                        className="border mr-1">

                        <span className="fa-layers fa-fw">

                            <i className="fas fa-envelope"/>

                            <NullCollapse open={count > 0}>

                                &nbsp; {count}

                            </NullCollapse>

                            <DropdownChevron/>

                        </span>

                </Button>

                <Popover trigger="legacy"
                         placement="bottom"
                         delay={{show: 0, hide: 0}}
                         isOpen={this.state.open}
                         toggle={() => this.toggle(false)}
                         target="notification-button"
                         className=""
                         style={{maxWidth: '600px'}}>

                    <PopoverBody className="shadow">

                        <NotificationList {...this.props}/>

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private toggle(open: boolean) {
        this.setState({...this.state, open});
    }

}

interface IProps {
    readonly invitations?: ReadonlyArray<GroupMemberInvitation>;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
    readonly open: boolean;
}
