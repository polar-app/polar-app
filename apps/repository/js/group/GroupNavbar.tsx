import * as React from 'react';
import {GroupNameStr} from "../../../../web/js/datastore/sharing/db/Groups";
import {Logger} from "../../../../web/js/logger/Logger";
import {SimpleTabs} from "../../../../web/js/ui/simple_tab/SimpleTabs";
import {SimpleTab} from "../../../../web/js/ui/simple_tab/SimpleTab";

const log = Logger.create();

export class GroupNavbar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);


    }


    public render() {

        return (
            <div>

                <div style={{display: 'flex'}}
                     className="w-100 ml-1">

                    <div style={{flexGrow: 1}}>
                        <h3>{this.props.groupName}</h3>
                    </div>

                </div>

                <SimpleTabs>
                    <SimpleTab href={`#group/${this.props.groupName}`} text="Documents"/>
                    <SimpleTab href={`#group/${this.props.groupName}/highlights`} text="Highlights"/>
                </SimpleTabs>
            </div>

        );
    }

}

export interface IProps {
    readonly groupName: GroupNameStr;
}

export interface IState {
}
