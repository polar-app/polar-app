import * as React from 'react';
import {DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from "../../../../../../../web/js/ui/fontawesome/FontAwesomeIcon";

export class AnnotationTypeDropdownItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }


    public render() {

        const {selected} = this.props;

        const iconName =  selected ? "far fa-check-square" : "far fa-square";

        return (
            <DropdownItem onClick={() => this.props.onClick()}
                          className={selected ? 'font-weight-bold' : undefined}>
                <FontAwesomeIcon name={iconName}/> {this.props.children}
            </DropdownItem>
        );

    }

}

interface IProps {

    readonly selected: boolean;
    readonly onClick: () => void;

}

interface IState {
}
