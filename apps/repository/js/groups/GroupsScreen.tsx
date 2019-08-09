import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group, Groups} from "../../../../web/js/datastore/sharing/db/Groups";
import {Logger} from "../../../../web/js/logger/Logger";
import {GroupsTable} from "./GroupsTable";
import {CreateGroupButton} from "./CreateGroupButton";
import {VerticalAlign} from "../../../../web/js/ui/util/VerticalAlign";

const log = Logger.create();

export class GroupsScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            groups: []
        };

    }


    public componentWillMount(): void {

        const doHandle = async (): Promise<void> => {

            const groups = await Groups.topGroups();

            this.setState({groups});

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

                            <div className="mt-2 p-2 border-top border-left border-right bg-grey000">

                                <div style={{display: 'flex'}}
                                     className="w-100">

                                    <div style={{flexGrow: 1}}>
                                        <h3>Groups</h3>
                                    </div>

                                    <VerticalAlign>
                                        <CreateGroupButton/>
                                    </VerticalAlign>

                                </div>

                            </div>

                            <GroupsTable persistenceLayerManager={this.props.persistenceLayerManager}
                                         groups={this.state.groups}/>

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
    readonly groups: ReadonlyArray<Group>;
}
