import React from "react";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import PaletteIcon from '@material-ui/icons/Palette';
import {MUIPopper} from "../../../../../web/js/mui/menu/MUIPopper";
import {ColorMenu} from "../../../../../web/js/ui/ColorMenu";

interface IProps {
    readonly selected: ReadonlyArray<ColorStr>;
    readonly onSelected: (newSelected: ReadonlyArray<ColorStr>) => void;
}

export const BlocksHighlightColorFilterButton = (props: IProps) => {
    const { selected, onSelected } = props;

    const handleChange = React.useCallback((item: ColorStr) => {
        const newSelected = selected.includes(item)
            ? selected.filter(x => x !== item)
            : [...selected, item];

        onSelected(newSelected);
    }, [selected, onSelected]);

    return (
        <MUIPopper variant="outlined"
                   text="Colors"
                   icon={<PaletteIcon />}
                   caret>

            <ColorMenu selected={props.selected} onChange={handleChange} />

        </MUIPopper>
    );

};
