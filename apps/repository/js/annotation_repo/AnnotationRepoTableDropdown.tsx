import * as React from 'react';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {UncontrolledDropdown} from "reactstrap";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class AnnotationRepoTableDropdown extends React.Component<IProps, IState> {

    public render() {

        return (

            <div className="text-right">

                <UncontrolledDropdown size="md">

                    <DropdownToggle color="light"
                                    size="md"
                                    className="table-dropdown-button btn text-muted p-1 m-0">

                        <i className="fas fa-ellipsis-h"/>

                    </DropdownToggle>

                    <DropdownMenu className="shadow" right>

                        <DropdownItem onClick={NULL_FUNCTION}>
                            Export
                        </DropdownItem>

                    </DropdownMenu>


                </UncontrolledDropdown>

            </div>
        );

    }

}

interface IProps {
}

interface IState {

}
