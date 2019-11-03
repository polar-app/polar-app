import * as React from 'react';
import {
    Button,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Popover,
    PopoverBody,
    UncontrolledDropdown
} from 'reactstrap';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {IDs} from "../../../../../web/js/util/IDs";
import {ColorButton} from '../../../../../web/js/ui/colors/ColorButton';
import {ColorSelectorBox} from "../../../../../web/js/ui/colors/ColorSelectorBox";

export class AnnotationTypeSelector extends React.PureComponent<IProps, IState> {

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.deactivate = this.deactivate.bind(this);

        this.state = {
            open: false
        };

        this.id = IDs.create('highlight-color-filter-button');

    }

    private deactivate() {

        this.setState({
            open: false
        });
    }

    private activate() {

        this.setState({
            open: true
        });

    }
    public render() {

        const {id, props} = this;

        const onSelected = props.onSelected || NULL_FUNCTION;

        return (

            <UncontrolledDropdown>


                <DropdownToggle className="text-muted"
                                color="light"
                                caret>

                    <i className="fas fa-cog" style={{fontSize: '17px'}}></i>

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

}

interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly onSelected?: (color: string) => void;

}

interface IState {
    readonly open: boolean;
}
