import * as React from 'react';
import {GroupURLs} from "../GroupURLs";
import {
    GroupNameStr,
    Groups
} from "../../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocAnnotations} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {Logger} from "../../../../../web/js/logger/Logger";
import {Toaster} from "../../../../../web/js/ui/toaster/Toaster";
import {FixedNav, FixedNavBody} from "../../FixedNav";
import {RepoHeader} from "../../repo_header/RepoHeader";
import {PersistenceLayerManager} from "../../../../../web/js/datastore/PersistenceLayerManager";
import {ProfileJoins} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {GroupHighlightData} from "./GroupHighlightData";

const log = Logger.create();

export class HighlightScreen extends React.Component<IProps, IState> {

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

            const docAnnotations = await GroupDocAnnotations.list(group.id);

            const docAnnotationProfileRecords = await ProfileJoins.join(docAnnotations);

            // this.setState({
            //     ...this.state,
            //     groupHighlightsData: {
            //         id: group.id,
            //         group,
            //         docAnnotationProfileRecords,
            //     }});

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


                            {/*<HighlightsTable persistenceLayerManager={this.props.persistenceLayerManager}*/}
                            {/*                 groupHighlightsData={this.state.groupHighlightsData}/>*/}

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
    readonly groupHighlightData?: GroupHighlightData;
}
