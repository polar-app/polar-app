import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {AnnotationTypeDropdownItem} from "./AnnotationTypeDropdownItem";
import {Buttons} from "../Buttons";

export class AnnotationTypeSelector extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }


    public render() {

        interface DropdownOption {
            readonly annotationType: AnnotationType;
            readonly label: string;
        }

        const options: ReadonlyArray<DropdownOption> = [
            {
                annotationType: AnnotationType.TEXT_HIGHLIGHT,
                label: 'text highlight'
            },
            {
                annotationType: AnnotationType.AREA_HIGHLIGHT,
                label: 'area highlight'
            },
            {
                annotationType: AnnotationType.COMMENT,
                label: 'comment'
            },
            {
                annotationType: AnnotationType.FLASHCARD,
                label: 'flashcard'
            },

        ];

        const buttonProps = Buttons.activeProps(this.props.selected.length > 0);

        return (

            <UncontrolledDropdown>

                <DropdownToggle color={buttonProps.color}
                                outline={buttonProps.outline}
                                size="sm"
                                caret>

                    <i className="fas fa-filter"/> <span className="d-none-mobile">Annotation Types</span>

                </DropdownToggle>

                <DropdownMenu className="shadow" right>
                    {options.map((current, idx) => {

                        const selected = this.props.selected.includes(current.annotationType);

                        const computeNewSelected = () => {
                            const newSelected = selected ?
                                this.props.selected.filter(item => item != current.annotationType) :
                                [...this.props.selected, current.annotationType];

                            return newSelected;

                        };

                        const newSelected = computeNewSelected();

                        const onClick = () => this.props.onSelected(newSelected);

                        return <AnnotationTypeDropdownItem key={idx}
                                                           selected={selected}
                                                           onClick={onClick}>
                            {current.label}
                        </AnnotationTypeDropdownItem>;

                    })}
                </DropdownMenu>

            </UncontrolledDropdown>
        );

    }


}

interface IProps {

    readonly selected: ReadonlyArray<AnnotationType>;

    readonly onSelected: (selected: ReadonlyArray<AnnotationType>) => void;

}

interface IState {
}
