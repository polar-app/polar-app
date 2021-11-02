import React from "react";
import clsx from "clsx";
import {createStyles, IconButton, makeStyles} from "@material-ui/core";
import {ColorStr} from "./colors/ColorSelectorBox";
import PaletteIcon from "@material-ui/icons/Palette";

export const MAIN_HIGHLIGHT_COLORS: ReadonlyArray<ColorStr> = [
    "yellow",
    "#8DFF76",
    "#F78DA7",

    "red",
    "green",
    "#FFFF00",

    "#00D084",
    "#8ED1FC",
    "#F96676",

    "#9900EF",
    "#0693E3",
    "#FCB900",

    "#FF6900",
    "#EB144C",
    "#7BDCB5",
];

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: "grid",
            gridTemplateRows: "repeat(3, 1fr)",
            gridAutoFlow: "column",
            background: theme.palette.background.default,
            padding: 6,
        },
        iconButton: {
            padding: 0,
            width: 26,
            height: 26,
            "&.selected": {
                border: `2px solid ${theme.palette.info.dark}`,
            },
        },
        item: {
            padding: 3,
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
    selected?: ReadonlyArray<ColorStr> | ColorStr;
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
                        className={clsx(classes.iconButton, { selected: Array.isArray(selected) ? selected.includes(color) : color === selected })}
                        onClick={() => onChange(color)}
                        disableRipple
                    >
                        { <PaletteIcon style={{ color, display: "block" }} /> }
                    </IconButton>
                    { withHints && i < hintLimit && <span className={classes.shortcutHint}>{i + 1}</span> }
                </div>
            ))}
        </div>
    );
});
