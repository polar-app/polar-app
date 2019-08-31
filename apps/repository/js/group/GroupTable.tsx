import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {GroupDocInfoCard} from "./GroupDocInfoCard";
import {GroupData} from "./GroupData";
import {LoadingProgress} from "../../../../web/js/ui/LoadingProgress";

export class GroupTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {groupData} = this.props;

        if (! groupData) {
            return <LoadingProgress/>;
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
