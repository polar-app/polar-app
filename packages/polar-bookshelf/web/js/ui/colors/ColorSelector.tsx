import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {RGBColor} from './ColorButton';
import {ColorSelectorBox} from './ColorSelectorBox';
import {MUIPopper} from "../../mui/menu/MUIPopper";
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

        <MUIPopper size="small"
                   icon={<PaletteIcon/>}>

            <ColorSelectorBox selected={[props.color]}
                              onSelected={onSelected}/>

        </MUIPopper>

    );

};
