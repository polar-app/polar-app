import * as React from 'react';
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import NoteIcon from '@material-ui/icons/Note';
import {MUIMenu} from "../../../../../../../web/js/mui/menu/MUIMenu";
import {AnnotationTypeMenuItem} from "./AnnotationTypeMenuItem";
import {IconWithColor} from "../../../../../../../web/js/ui/IconWithColor";

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

        // const buttonProps = Buttons.activeProps(this.props.selected.length > 0);

        return (

            <MUIMenu caret
                     button={{
                         text: "Annotations",
                         variant: 'outlined',
                         icon: <IconWithColor color="text.secondary" Component={NoteIcon}/>,
                     }}>

                <div>
                    {options.map((current, idx) => {

                        const selected = this.props.selected.includes(current.annotationType);

                        const computeNewSelected = () => {
                            const newSelected = selected ?
                                this.props.selected.filter(item => item !== current.annotationType) :
                                [...this.props.selected, current.annotationType];

                            return newSelected;

                        };

                        const newSelected = computeNewSelected();

                        const onClick = () => this.props.onSelected(newSelected);

                        return <AnnotationTypeMenuItem key={idx}
                                                       selected={selected}
                                                       onClick={onClick}>
                            {current.label}
                        </AnnotationTypeMenuItem>;

                    })}
                </div>

            </MUIMenu>

        );

    }


}

interface IProps {

    readonly selected: ReadonlyArray<AnnotationType>;

    readonly onSelected: (selected: ReadonlyArray<AnnotationType>) => void;

}

interface IState {
}
