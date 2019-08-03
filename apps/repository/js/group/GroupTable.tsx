import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group} from "../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocInfoCard} from "./GroupDocInfoCard";
import {GroupDocInfo} from "../../../../web/js/datastore/sharing/GroupDocInfos";

export class GroupTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {groupDocInfos} = this.props;

        return (

            <div className="border-bottom mt-2">
                {groupDocInfos.map(groupDocInfo =>
                    <GroupDocInfoCard persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}
                                      key={groupDocInfo.fingerprint} {...groupDocInfo}/>)}
            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly groupDocInfos: ReadonlyArray<GroupDocInfo>;
}

export interface IState {
}
