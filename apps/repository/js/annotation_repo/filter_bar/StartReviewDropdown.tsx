import * as React from 'react';
import {Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {SimpleTooltipEx} from "../../../../../web/js/ui/tooltip/SimpleTooltipEx";
import {ManualDropdown} from "../../doc_repo/ManaulDropdown";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class StartReviewDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <UncontrolledDropdown>
                <DropdownToggle caret>
                    Dropdown
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Header</DropdownItem>
                    <DropdownItem disabled>Action</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );

            {/*<UncontrolledDropdown size="sm"*/}
            {/*                      direction="down"*/}
            {/*                      id="start-review-dropdown">*/}

            {/*    <DropdownToggle size="sm"*/}
            {/*                    style={{fontWeight: 'bold'}}*/}
            {/*                    color="success" caret>*/}

            {/*        <i className="fas fa-graduation-cap mr-1"/> Start Review*/}

            {/*    </DropdownToggle>*/}

            {/*    <DropdownMenu>*/}

            {/*        <DropdownItem size="sm"*/}
            {/*                      onClick={NULL_FUNCTION}>*/}
            {/*            ... reading*/}
            {/*        </DropdownItem>*/}


            {/*        <DropdownItem size="sm"*/}
            {/*                      onClick={NULL_FUNCTION}>*/}
            {/*            ... flashcards*/}
            {/*        </DropdownItem>*/}

            {/*    </DropdownMenu>*/}

            {/*</UncontrolledDropdown>*/}

            //
            // <Button color="success"
            //         size="sm"
            //         className="font-weight-bold"
            //         style={{whiteSpace: 'nowrap'}}
            //         onClick={() => this.props.onClick()}>
            //
            //         <i className="fas fa-graduation-cap mr-1"/> Start Review
            //
            // </Button>

    }


}

export interface IProps {

}

interface IState {

}
