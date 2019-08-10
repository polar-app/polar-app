import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group} from "../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocInfoCard} from "./GroupDocInfoCard";
import {GroupDocInfo} from "../../../../web/js/datastore/sharing/GroupDocInfos";
import {GroupData} from "./GroupData";

export class GroupTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {groupData} = this.props;

        if (! groupData) {
            return <div/>;
        }

        return (

            <div className="border-bottom">
                {groupData.groupDocInfos.map(groupDocInfo =>
                    <GroupDocInfoCard persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}
                                      key={groupDocInfo.fingerprint} {...groupDocInfo}/>)}
            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly groupData?: GroupData;
}

export interface IState {
}
