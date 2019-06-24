import React from 'react';
import Button from 'reactstrap/lib/Button';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {GroupDatastores} from '../../datastore/sharing/GroupDatastores';
import {GroupDocRef} from '../../datastore/sharing/GroupDatastores';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';
import {Toaster} from '../toaster/Toaster';
import {Logger} from '../../logger/Logger';
import {GroupJoins} from '../../datastore/sharing/rpc/GroupJoins';

const log = Logger.create();

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

        const {invitation} = this.props;
        const {groupID} = invitation;

        const doGroupJoinAndAddDocs = async () => {

            await GroupJoins.exec({groupID});

            for (const docRef of invitation.docs) {

                const groupDocRef: GroupDocRef = {
                    groupID,
                    docRef
                };

                log.info("Going to importFromGroup");
                await GroupDatastores.importFromGroup(persistenceLayer, groupDocRef);

            }

        };

        doGroupJoinAndAddDocs()
            .then(() => Toaster.success("Added documents successfully to document repository."))
            .catch(err => {
                const msg = "Failed to add document to repository: ";
                log.error(msg, err);
                Toaster.error(msg + err.message);
            });

    }

}

interface IProps {
    readonly invitation: GroupMemberInvitation;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
}
