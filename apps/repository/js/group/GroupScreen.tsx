import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group, Groups} from "../../../../web/js/datastore/sharing/db/Groups";
import {Logger} from "../../../../web/js/logger/Logger";
import {GroupTable} from "./GroupTable";
import {Arrays} from "../../../../web/js/util/Arrays";
import {
    GroupDocInfo,
    GroupDocInfos
} from "../../../../web/js/datastore/sharing/GroupDocInfos";
import {Toaster} from "../../../../web/js/ui/toaster/Toaster";
import {AuthHandlers} from "../../../../web/js/apps/repository/auth_handler/AuthHandler";

const log = Logger.create();

export class GroupScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            groupDocInfos: []
        };

    }

    public componentWillMount(): void {

        // get the group name from the URL
        const getGroupName = () => {

            const parts = document.location.href.split("/");
            return Arrays.last(parts);

        };

        const doHandle = async (): Promise<void> => {

            await AuthHandlers.requireAuthentication();

            const groupName = getGroupName();

            if (! groupName) {
                Toaster.error("No group name");
                return;
            }

            const group = await Groups.getByName(groupName);

            if (! group) {
                Toaster.error("No group named: " + groupName);
                return;
            }

            const groupDocInfos = await GroupDocInfos.list(group.id);

            this.setState({groupDocInfos});

        };

        doHandle().catch(err => log.error("Unable to get groups: ", err));

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                </header>

                <FixedNavBody className="container">

                    <div className="row">

                        <div className="col">

                            {/*<div className="mt-2 p-2 border-top border-left border-right bg-grey000">*/}

                            {/*    <div style={{display: 'flex'}}*/}
                            {/*         className="w-100">*/}

                            {/*        <div style={{flexGrow: 1}}>*/}
                            {/*            <h3>Groups</h3>*/}
                            {/*        </div>*/}

                            {/*        <div className="text-right">*/}
                            {/*            <a href="#groups/create"*/}
                            {/*               className="btn btn-success btn-sm">Create Group</a>*/}
                            {/*        </div>*/}

                            {/*    </div>*/}

                            {/*</div>*/}

                            <GroupTable persistenceLayerManager={this.props.persistenceLayerManager}
                                        groupDocInfos={this.state.groupDocInfos}/>

                        </div>

                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

export interface IState {
    readonly groupDocInfos: ReadonlyArray<GroupDocInfo>;
}
