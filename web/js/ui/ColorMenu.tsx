import React from "react";
import clsx from "clsx";
import {createStyles, IconButton, makeStyles} from "@material-ui/core";
import {ColorStr} from "./colors/ColorSelectorBox";
import PaletteIcon from "@material-ui/icons/Palette";

export const MAIN_HIGHLIGHT_COLORS: ReadonlyArray<ColorStr> = [
    "#E8EC3A",
    "#7EEC3A",
    "#3AECE1",
    "#EC3A7A",
    "#2B5C6B",
    "#EC3A3A",
    "#E83AEC",
    "#4C8B65",
    "#CBB958",
    "#7E4A79",
    "#3A76EC",
    "#ECAF3A",
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
            "&.selected": {
            },
            "&:hover": {
            },
        }
    }),
);

type IColorMenuProps = {
    selected?: ColorStr;
    onChange: (color: ColorStr) => void;
};

export const ColorMenu= React.forwardRef<HTMLDivElement, IColorMenuProps>(({ selected, onChange }, ref) => {
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
