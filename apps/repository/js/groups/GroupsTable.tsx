import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group} from "../../../../web/js/datastore/sharing/db/Groups";
import {GroupCard} from "./GroupCard";

export class GroupsTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {groups} = this.props;

        return (

            <div>
                {groups.map(group =>
                    <GroupCard key={group.id} group={group}/>)}
            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly groups: ReadonlyArray<Group>;
}

export interface IState {
}
