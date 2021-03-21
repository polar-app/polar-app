import React from 'react';
import {
    GroupJoinRequest,
    GroupJoins
} from "../../../../web/js/datastore/sharing/rpc/GroupJoins";
import {Logger} from "polar-shared/src/logger/Logger";
import {Toaster} from "../../../../web/js/ui/toaster/Toaster";
import {
    GroupNameStr,
    Groups
} from "../../../../web/js/datastore/sharing/db/Groups";
import Button from '@material-ui/core/Button';

const log = Logger.create();

export class GroupJoinButton extends React.PureComponent<IProps, IState> {

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

                    Join

                </Button>

            </div>

        );

    }

    private onJoin() {

        const handler = async () => {

            // TODO: needed for 2.0 when we turn on groups again
            // await AuthHandlers.requireAuthentication();

            const group = await Groups.getByName(this.props.name);

            if (! group) {
                Toaster.error("No group named: " + this.props.name);
                return;
            }

            Toaster.info("Joining group...");

            const request: GroupJoinRequest = {
                groupID: group.id
            };

            await GroupJoins.exec(request);

            Toaster.success("Joining group...done");

        };

        handler()
            .catch(err => log.error("Unable to join group: ", err));
    }

}

interface IProps {

    readonly name: GroupNameStr;

}

interface IState {
}
