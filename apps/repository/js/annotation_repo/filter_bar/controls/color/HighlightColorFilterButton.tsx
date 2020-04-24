import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {
    ColorSelectorBox,
    ColorStr
} from "../../../../../../../web/js/ui/colors/ColorSelectorBox";
import {Buttons} from "../Buttons";
import PaletteIcon from '@material-ui/icons/Palette';
import {MUIPopper} from "../../../../../../../web/spectron0/material-ui/dropdown_menu/MUIPopper";

interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly color?: 'primary' | 'secondary';

    readonly onSelected?: (selected: ReadonlyArray<ColorStr>) => void;

    readonly selected?: ReadonlyArray<ColorStr>;

}

export const HighlightColorFilterButton = (props: IProps) => {

    const {selected} = props;

    const active = selected !== undefined && selected.length > 0;
    const buttonProps = Buttons.activeProps(active);

    const handleSelected = (color: ColorStr) => {

        const onSelected = props.onSelected || NULL_FUNCTION;

        const selected = props.selected || [];

        const newSelected = selected.includes(color) ?
            selected.filter(current => current !== color) :
            [...selected, color];

        onSelected(newSelected);

    };

    return (

        <div className={props.className || ''}
             style={props.style}>

            <MUIPopper variant="contained"
                       style={{
                            whiteSpace: 'nowrap'
                       }}
                       size="small"
                       caret={true}
                       text="Colors"
                       icon={<PaletteIcon/>}
                       >

                <ColorSelectorBox selected={props.selected}
                                  onSelected={(color) => handleSelected(color)}/>

            </MUIPopper>
        </div>

    );

};
