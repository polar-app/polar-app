import React from 'react';
import {
    GroupMemberInvitation,
    GroupMemberInvitations
} from '../../datastore/sharing/db/GroupMemberInvitations';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Toaster} from '../toaster/Toaster';
import {NotificationButton} from './NotificationButton';
import {Devices} from "polar-shared/src/util/Devices";

const log = Logger.create();

/**
 * @NotStale needs porting to Polar 2.0
 */
export class Notifications extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            invitations: []
        };

        GroupMemberInvitations.onSnapshot(invitations => {

            console.log("Got invitations: ", invitations);

            this.setState({invitations});

        }).catch(err => {
            const msg = "Unable to get group notifications: ";
            log.error(msg, err);
            Toaster.error(msg, err.message);
        });

    }

    public render() {

        if (! Devices.isDesktop()) {
            return null;
        }

        return (

            <NotificationButton persistenceLayerProvider={this.props.persistenceLayerProvider}
                                invitations={this.state.invitations}/>

        );

    }


}

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
    readonly invitations: ReadonlyArray<GroupMemberInvitation>;
}
