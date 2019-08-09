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
import {VerticalAlign} from "../../../../web/js/ui/util/VerticalAlign";
import {CreateGroupButton} from "../groups/CreateGroupButton";

const log = Logger.create();

export class GroupScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.getGroupName = this.getGroupName.bind(this);

        this.state = {
            name: this.getGroupName(),
            groupDocInfos: []
        };

    }

    private getGroupName() {

        const parts = document.location.href.split("/");

        if (parts.length === 0) {
            throw new Error("No group");
        }

        return Arrays.last(parts)!;
    }

    public componentWillMount(): void {

        const doHandle = async (): Promise<void> => {

            await AuthHandlers.requireAuthentication();

            const groupName = this.getGroupName();

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

                            <div className="mt-2 p-2 border-top border-left border-right bg-grey000">

                                <div style={{display: 'flex'}}
                                     className="w-100">

                                    <div style={{flexGrow: 1}}>
                                        <h3>{this.state.name}</h3>
                                    </div>

                                    <VerticalAlign>
                                        {/*<CreateGroupButton/>*/}
                                    </VerticalAlign>

                                </div>

                            </div>

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
    readonly name: string;
    readonly groupDocInfos: ReadonlyArray<GroupDocInfo>;
}
