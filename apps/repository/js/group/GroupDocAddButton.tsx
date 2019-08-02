/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from 'reactstrap/lib/Button';
import {GroupIDStr} from "../../../../web/js/datastore/Datastore";
import {NULL_FUNCTION} from "../../../../web/js/util/Functions";
import {
    GroupJoinRequest,
    GroupJoins
} from "../../../../web/js/datastore/sharing/rpc/GroupJoins";
import {Logger} from "../../../../web/js/logger/Logger";
import {Toaster} from "../../../../web/js/ui/toaster/Toaster";

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
                        size="sm"
                        onClick={() => this.onJoin()}
                        className="pl-2 pr-2">

                    Join

                </Button>

            </div>

        );

    }

    private onJoin() {

        const handler = async () => {

            Toaster.info("Joining group...");

            const request: GroupJoinRequest = {
                groupID: this.props.groupID
            };

            await GroupJoins.exec(request);

            Toaster.success("Joining group...done");

        };

        handler().catch(err => log.error("Unable to join group: ", err));
    }

}

interface IProps {

    readonly groupID: GroupIDStr;

}

interface IState {
}
