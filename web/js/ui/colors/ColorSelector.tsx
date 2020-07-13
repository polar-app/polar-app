import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {RGBColor} from './ColorButton';
import {ColorSelectorBox} from './ColorSelectorBox';
import {MUIPopper} from "../../mui/menu/MUIPopper";
import PaletteIcon from "@material-ui/icons/Palette";
import Tooltip from '@material-ui/core/Tooltip';


interface IProps {

    /**
     * The role if this selector whether it's to change or select a color.
     */
    readonly role: 'change' | 'select';

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly color: RGBColor;

    readonly onSelected?: (color: string) => void;

}

export const ColorSelector = (props: IProps) => {

    const onSelected = props.onSelected || NULL_FUNCTION;

    return (
        // <Tooltip title={`Used to ${props.role} the color.`}>
            <MUIPopper size="small"
                       icon={<PaletteIcon/>}>

                <ColorSelectorBox selected={[props.color]}
                                  onSelected={onSelected}/>

            </MUIPopper>
        // </Tooltip>
    );

};
