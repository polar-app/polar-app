import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {RGBColor} from './ColorButton';
import {ColorSelectorBox} from './ColorSelectorBox';
import {MUIPopper} from "../../../spectron0/material-ui/dropdown_menu/MUIPopper";
import PaletteIcon from "@material-ui/icons/Palette";


interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly color: RGBColor;

    readonly onSelected?: (color: string) => void;

}

export const ColorSelector  = (props: IProps) => {

    const onSelected = props.onSelected || NULL_FUNCTION;

    return (

        <MUIPopper variant="contained"
                   style={{
                       whiteSpace: 'nowrap'
                   }}
                   size="small"
                   caret={true}
                   text="Colors"
                   icon={<PaletteIcon/>}>

            <ColorSelectorBox selected={[props.color]}
                              onSelected={onSelected}/>

        </MUIPopper>

    );

};
