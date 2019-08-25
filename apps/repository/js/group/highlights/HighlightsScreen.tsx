import * as React from 'react';
import {GroupURLs} from "../GroupURLs";
import {
    GroupNameStr,
    Groups
} from "../../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocAnnotations} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {GroupHighlightsData} from "./GroupHighlightsData";
import {Logger} from "../../../../../web/js/logger/Logger";
import {Toaster} from "../../../../../web/js/ui/toaster/Toaster";
import {FixedNav, FixedNavBody} from "../../FixedNav";
import {RepoHeader} from "../../repo_header/RepoHeader";
import {PersistenceLayerManager} from "../../../../../web/js/datastore/PersistenceLayerManager";
import {HighlightsTable} from "./HighlightsTable";

const log = Logger.create();

export class HighlightsScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        const groupURL = GroupURLs.parse(document.location.href);

        this.state = {
            name: groupURL.name
        };

    }

    public componentWillMount(): void {

        const doHandle = async (): Promise<void> => {

            const groupName = this.state.name;

            const group = await Groups.getByName(groupName);

            if (! group) {
                Toaster.error("No group named: " + groupName);
                return;
            }

            const groupDocAnnotations = await GroupDocAnnotations.list(group.id);

            this.setState({
                ...this.state,
                groupHighlightsData: {
                    id: group.id,
                    group,
                    groupDocAnnotations,
                }});

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
                                        <h3>Highlights for {this.state.name}</h3>
                                    </div>

                                </div>

                            </div>

                            <HighlightsTable persistenceLayerManager={this.props.persistenceLayerManager}
                                             groupHighlightsData={this.state.groupHighlightsData}/>

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
    readonly name: GroupNameStr;
    readonly groupHighlightsData?: GroupHighlightsData;
}
