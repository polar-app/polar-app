import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {
    ColorSelectorBox,
    ColorStr
} from "../../../../../../../web/js/ui/colors/ColorSelectorBox";
import PaletteIcon from '@material-ui/icons/Palette';
import {MUIPopper, usePopperController} from "../../../../../../../web/js/mui/menu/MUIPopper";
import {ResetableColorSelectorBox} from "../../../../../../../web/js/ui/colors/ResetableColorSelectorBox";
import {deepMemo} from "../../../../../../../web/js/react/ReactUtils";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly color?: 'primary' | 'secondary';

    readonly onSelected?: (selected: ReadonlyArray<ColorStr>) => void;

    readonly selected?: ReadonlyArray<ColorStr>;

}

const ColorSelector = deepMemo(function ColorSelector(props: IProps) {

    const popperController = usePopperController();
    const onSelected = props.onSelected || NULL_FUNCTION;

    const handleSelected = React.useCallback((color: ColorStr) => {

        const selected = props.selected || [];

        const newSelected = selected.includes(color) ?
            selected.filter(current => current !== color) :
            [...selected, color];

        onSelected(newSelected);

    }, [onSelected, props.selected]);

    const handleReset = React.useCallback(() => {
        onSelected([]);
        popperController.dismiss();
    }, [onSelected, popperController]);

    return (
        <ClickAwayListener onClickAway={popperController.dismiss}>
            <div>
                <ResetableColorSelectorBox selected={props.selected}
                                           onReset={handleReset}
                                           onSelected={handleSelected}/>
            </div>
        </ClickAwayListener>
    );

});

export const HighlightColorFilterButton = deepMemo(function HighlightColorFilterButton(props: IProps) {

    return (

        <div className={props.className || ''}
             style={props.style}>

            <MUIPopper variant="outlined"
                       style={{
                            whiteSpace: 'nowrap'
                       }}
                       caret={true}
                       text="Colors"
                       icon={<PaletteIcon/>}
                       >

                <ColorSelector {...props}/>

            </MUIPopper>
        </div>

    );

});
