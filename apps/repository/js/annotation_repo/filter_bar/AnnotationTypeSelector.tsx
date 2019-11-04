import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";

export class AnnotationTypeSelector extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }


    public render() {

        return (

            <UncontrolledDropdown>

                <DropdownToggle className="text-muted"
                                color="light"
                                caret>

                    <i className="fas fa-cog" style={{fontSize: '17px'}}/>

                </DropdownToggle>

                <DropdownMenu className="shadow" right>
                    <DropdownItem>area highlight</DropdownItem>
                    <DropdownItem>text highlight</DropdownItem>
                    <DropdownItem>comment</DropdownItem>
                    <DropdownItem>flashcard</DropdownItem>
                </DropdownMenu>

            </UncontrolledDropdown>
        );

    }

    static Item = class extends React.PureComponent<any, any> {

    }

}

interface IProps {

    readonly selected: ReadonlyArray<AnnotationType>;

    readonly onSelected: (selected: ReadonlyArray<AnnotationType>) => void;

}

interface IState {
}
