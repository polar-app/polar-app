import React from "react";
import clsx from "clsx";
import {createStyles, fade, IconButton, makeStyles} from "@material-ui/core";
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

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: "grid",
            gridTemplateRows: "repeat(3, 1fr)",
            gridAutoFlow: "column",
            padding: 6,
        },
        iconButton: {
            padding: 0,
            "&.selected": {
                backgroundColor: fade(theme.palette.action.active, theme.palette.action.hoverOpacity),
            },
        },
        item: {
            padding: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        shortcutHint: {
            marginLeft: 2,
        },
    }),
);

type IColorMenuProps = {
    onChange: (color: ColorStr) => void;
    selected?: ColorStr;
    withHints?: boolean;
    hintLimit?: number;
};

export const ColorMenu = React.forwardRef<HTMLDivElement, IColorMenuProps>((props, ref) => {
    const classes = useStyles();
    const {selected, onChange, withHints = false, hintLimit = 6} = props;

    return (
        <div ref={ref} className={classes.root}>
            {MAIN_HIGHLIGHT_COLORS.map((color, i) => (
                <div className={classes.item} key={color}>
                    <IconButton
                        className={clsx(classes.iconButton, { selected: selected === color })}
                        disableRipple
                        onClick={() => onChange(color)}
                    >
                        { <PaletteIcon style={{ color, display: "block" }} /> }
                    </IconButton>
                    { withHints && i < hintLimit && <span className={classes.shortcutHint}>{i + 1}</span> }
                </div>
            ))}
        </div>
    );
});
