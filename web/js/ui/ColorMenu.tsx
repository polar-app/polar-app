import React from "react";
import clsx from "clsx";
import {createStyles, IconButton, makeStyles} from "@material-ui/core";
import {ColorStr} from "./colors/ColorSelectorBox";
import PaletteIcon from "@material-ui/icons/Palette";

export const MAIN_HIGHLIGHT_COLORS: ReadonlyArray<ColorStr> = [
    "#E8EC3A",
    "#EC3A3A",
    "#3A76EC",
    "#E83AEC",
    "#7EEC3A",

    "#ECAF3A",
    "#EC3A7A",
    "#4C8B65",
    "#CBB958",
    "#7E4A79",

    "#3AECE1",
    "#2B5C6B",
    "#6C50A9",
    "#F3D848",
    "#B02F2F",
];

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            padding: 6,
        },
        item: {
            padding: 6,
            cursor: "pointer",
        }
    }),
);

type IColorMenuProps = {
    selected?: ColorStr;
    onChange: (color: ColorStr) => void;
};

export const ColorMenu = React.forwardRef<HTMLDivElement, IColorMenuProps>(({ selected, onChange }, ref) => {
    const classes = useStyles();

    return (
        <div ref={ref} className={classes.root}>
            {MAIN_HIGHLIGHT_COLORS.map(color => (
                <IconButton
                    className={clsx(classes.item, { selected: selected === color })}
                    disableRipple
                    key={color}
                    onClick={() => onChange(color)}
                >
                    { <PaletteIcon style={{ color, display: "block" }} /> }
                </IconButton>
            ))}
        </div>
    );
});
