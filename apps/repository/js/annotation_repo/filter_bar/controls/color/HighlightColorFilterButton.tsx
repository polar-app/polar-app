import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {
    ColorSelectorBox,
    ColorStr
} from "../../../../../../../web/js/ui/colors/ColorSelectorBox";
import {DropdownChevron} from "../../../../../../../web/js/ui/util/DropdownChevron";
import {Buttons} from "../Buttons";
import Popover from '@material-ui/core/Popover';
import {MUIDropdownCaret} from "../../../../../../../web/spectron0/material-ui/MUIDropdownCaret";
import PaletteIcon from '@material-ui/icons/Palette';
import Button from "@material-ui/core/Button";

interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly color?: 'primary' | 'secondary';

    readonly onSelected?: (selected: ReadonlyArray<ColorStr>) => void;

    readonly selected?: ReadonlyArray<ColorStr>;

}

export const HighlightColorFilterButton = (props: IProps) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const {selected} = props;

    const onSelected = props.onSelected || NULL_FUNCTION;

    const active = selected !== undefined && selected.length > 0;
    const buttonProps = Buttons.activeProps(active);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelected = (color: ColorStr) => {

        const onSelected = props.onSelected || NULL_FUNCTION;

        handleClose();

        const selected = props.selected || [];

        const newSelected = selected.includes(color) ?
            selected.filter(current => current !== color) :
            [...selected, color];

        onSelected(newSelected);

    };

    return (

        <div className={props.className || ''}
             style={props.style}>

            <Button variant="contained"
                    style={{
                        whiteSpace: 'nowrap'
                    }}
                    size="small"
                    startIcon={<PaletteIcon/>}
                    endIcon={<MUIDropdownCaret/>}
                    onClick={handleClick}>

                Colors

            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                <ColorSelectorBox selected={props.selected}
                                  onSelected={(color) => handleSelected(color)}/>


            </Popover>

        </div>
    );

};
