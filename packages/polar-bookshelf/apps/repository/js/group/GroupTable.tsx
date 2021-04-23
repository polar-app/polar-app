import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {GroupDocInfoCard} from "./GroupDocInfoCard";
import {GroupData} from "./GroupData";
import {LoadingProgress} from "../../../../web/js/ui/LoadingProgress";
import {Pagination} from "../../../../web/js/ui/Pagination";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

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

            <Pagination results={groupData.groupDocInfos}>
                <div className="border-bottom">

                    {groupData.groupDocInfos.map(groupDocInfo =>
                        <GroupDocInfoCard persistenceLayerProvider={this.props.persistenceLayerProvider}
                                          key={groupDocInfo.fingerprint} {...groupDocInfo}/>)}
                </div>
            </Pagination>

        );
    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly groupData?: GroupData;
}

export interface IState {
}
