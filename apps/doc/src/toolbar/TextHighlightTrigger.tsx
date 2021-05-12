import React from "react";
import PaletteIcon from '@material-ui/icons/Palette';
import {ClickAwayListener, createStyles, Grow, makeStyles, Paper, Popper, Theme, useTheme} from "@material-ui/core";
import {ColorStr} from "../../../../web/js/ui/colors/ColorSelectorBox";
import {ColorMenu, MAIN_HIGHLIGHT_COLORS} from "../../../../web/js/ui/ColorMenu";
import {StandardIconButton} from "../../../repository/js/doc_repo/buttons/StandardIconButton";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";

type IUseStylesProps = {
    textHighlightColor?: ColorStr;
}

const useStyles = makeStyles<Theme, IUseStylesProps>((theme) =>
    createStyles({
        root: {
            display: "flex",
            alignItems: "center",
        },
        triggerIcon: ({ textHighlightColor }) => ({
            color: textHighlightColor || theme.palette.text.secondary,
        }),
        dropdown: { cursor: "pointer" },
        dropdownMenu: { transformOrigin: "top center" },
    }),
);

export const TextHighlightTrigger: React.FC = () => {
    const theme = useTheme();
    const {textHighlightColor} = useDocViewerStore(['textHighlightColor']);
    const [selectedColor, setSelectedColor] = React.useState<ColorStr>(MAIN_HIGHLIGHT_COLORS[0]);
    const {setTextHighlightColor} = useDocViewerCallbacks();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles({ textHighlightColor });;

    const handleColorChange = React.useCallback((color: ColorStr) => {
        setOpen(false);
        setTextHighlightColor(color);
        setSelectedColor(color);
    }, [setOpen, setTextHighlightColor, setSelectedColor]);

    const handleClick = React.useCallback(() => {
        if (textHighlightColor) {
            setTextHighlightColor(undefined);
        } else {
            setTextHighlightColor(selectedColor);
        }
    }, [textHighlightColor, setTextHighlightColor, selectedColor]);

    const handleToggle = React.useCallback(() => setOpen(prevOpen => !prevOpen), [setOpen]);

    const handleClose = React.useCallback((event: React.MouseEvent<Document, MouseEvent>) => {
        const anchor = anchorRef.current;
        if (anchor && anchor.contains(event.target as HTMLElement)) {
          return;
        }

        setOpen(false);
    }, [setOpen]);


    return (
        <>
            <div ref={anchorRef} className={classes.root}>
                <StandardIconButton tooltip="Text highlight mode" onClick={handleClick}>
                    <PaletteIcon className={classes.triggerIcon}/>
                </StandardIconButton>
                <ArrowDropDownIcon className={classes.dropdown} onClick={handleToggle} />
            </div>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom"
                style={{ zIndex: theme.zIndex.modal }}
                transition
                disablePortal
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper
                            className={classes.dropdownMenu}
                            style={{ background: theme.palette.background.paper }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <ColorMenu onChange={handleColorChange} selected={selectedColor} />
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};
