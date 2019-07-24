/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from 'reactstrap/lib/Button';
import {GroupIDStr} from "../../../../web/js/datastore/Datastore";
import {NULL_FUNCTION} from "../../../../web/js/util/Functions";

export class GroupJoinButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }


    public render() {

        return (

            <div className="mr-1 ml-1">

                <Button color="primary"
                        size="sm"
                        onClick={NULL_FUNCTION}
                        className="pl-2 pr-2">

                    Join

                </Button>

            </div>

        );

    }

}

interface IProps {

    readonly groupID: GroupIDStr;

}

interface IState {
}
