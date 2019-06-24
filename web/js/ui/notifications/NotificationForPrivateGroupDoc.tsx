import React from 'react';
import Button from 'reactstrap/lib/Button';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {GroupDatastores} from '../../datastore/sharing/GroupDatastores';
import {GroupDocRef} from '../../datastore/sharing/GroupDatastores';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {Toaster} from '../toaster/Toaster';

export class NotificationForPrivateGroupDoc extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onAdd = this.onAdd.bind(this);


    }

    public render() {

        return (

            <div className="">

                <div className="notification-sender">
                    {this.props.invitation.from.name}
                </div>

                <Button color="primary"
                        size="sm"
                        onClick={() => this.onAdd()}
                        style={{fontSize: '15px'}}
                        className="">

                    Add

                </Button>

            </div>

        );

    }

    private onAdd() {

        const persistenceLayer = this.props.persistenceLayerProvider();

        Toaster.info("Adding documents to document repository");

        const doAdd = async () => {

            for (const docRef of this.props.invitation.docs) {

                const groupDocRef: GroupDocRef = {
                    groupID: this.props.invitation.groupID,
                    docRef
                };

                await GroupDatastores.importFromGroup(persistenceLayer, groupDocRef)

            }

        };

        doAdd()
            .then(() => Toaster.success("Added documents successfully to document repository."))
            .catch(err => Toaster.error("Failed to add document to repository: " + err.message));



    }

}

interface IProps {
    readonly invitation: GroupMemberInvitation;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
}
