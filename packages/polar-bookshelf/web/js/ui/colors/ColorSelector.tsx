import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {RGBColor} from './ColorButton';
import {ColorSelectorBox} from './ColorSelectorBox';
import {MUIPopper, usePopperController} from "../../mui/menu/MUIPopper";
import PaletteIcon from "@material-ui/icons/Palette";
import {deepMemo} from "../../react/ReactUtils";

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

interface ColorSelectorInnerProps {
    readonly color: RGBColor;
    readonly onColor: (color: string) => void;
}

const ColorSelectorInner = deepMemo(function ColorSelectorInner(props: ColorSelectorInnerProps) {

    const popperController = usePopperController();

    const handleSelected = React.useCallback((color: RGBColor) => {
        props.onColor(color);
        popperController.dismiss();
    }, [popperController, props]);

    return (
        <ColorSelectorBox selected={[props.color]}
                          onSelected={handleSelected}/>
    );

});

export const ColorSelector = deepMemo(function ColorSelector(props: IProps) {

    const onSelected = props.onSelected || NULL_FUNCTION;

    const [color, setColor] = React.useState<RGBColor>(props.color);

    const handleSelected = React.useCallback((color: RGBColor) => {
        setColor(color);
        onSelected(color);
    }, [onSelected]);

    return (
        // <Tooltip title={`Used to ${props.role} the color.`}>
            <MUIPopper size="small"
                       icon={<PaletteIcon/>}>
                <div>
                    <ColorSelectorInner color={color} onColor={handleSelected}/>
                </div>

            </MUIPopper>
        // </Tooltip>
    );

});
