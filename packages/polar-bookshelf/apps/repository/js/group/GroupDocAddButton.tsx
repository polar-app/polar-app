import React from 'react';
import {GroupIDStr} from "../../../../web/js/datastore/Datastore";
import {Logger} from "polar-shared/src/logger/Logger";
import {Toaster} from "../../../../web/js/ui/toaster/Toaster";
import {
    GroupDatastores,
    GroupDocRef
} from "../../../../web/js/datastore/sharing/GroupDatastores";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {GroupDocs} from "../../../../web/js/datastore/sharing/db/GroupDocs";
import {AuthHandlers} from "../../../../web/js/apps/repository/auth_handler/AuthHandler";
import Button from "@material-ui/core/Button";

const log = Logger.create();

export class GroupDocAddButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onJoin = this.onJoin.bind(this);

        this.state = {
        };

    }


    public render() {

        return (

            <div className="mr-1 ml-1">

                <Button color="primary"
                        variant="contained"
                        onClick={() => this.onJoin()}
                        className="pl-2 pr-2">

                    <i className="fas fa-plus" style={{marginRight: '5px'}}/> Add

                </Button>

            </div>

        );

    }

    private onJoin() {

        const handler = async () => {

            // TODO: needed for 2.0 when we turn on groups again
            // await AuthHandlers.requireAuthentication();

            const {groupID, fingerprint} = this.props;

            Toaster.info("Adding document to your document repository...");

            const docRefs = await GroupDocs.getByFingerprint(groupID, fingerprint);

            if (docRefs.length === 0) {
                Toaster.error("No group docs to add");
                return;
            }

            const docRef = docRefs[0];

            const groupDocRef: GroupDocRef = {
                groupID,
                docRef
            };

            const persistenceLayer = this.props.persistenceLayerProvider();

            await GroupDatastores.importFromGroup(persistenceLayer, groupDocRef);

            Toaster.success("Adding document to your document repository...done");

        };

        handler()
            .catch(err => log.error("Unable to join group: ", err));
    }

}

interface IProps {

    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly groupID: GroupIDStr;
    readonly fingerprint: string;

}

interface IState {
}
