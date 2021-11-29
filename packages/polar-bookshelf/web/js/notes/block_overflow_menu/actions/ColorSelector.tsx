import React from "react";
import {Box, createStyles, makeStyles, Theme} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {MAIN_HIGHLIGHT_COLORS} from "../../../ui/ColorMenu";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {ColorStr} from "../../../ui/colors/ColorSelectorBox";
import {observer} from "mobx-react-lite";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useHighlightBlockColor, useHighlightBlockColorChanger} from "../../AnnotationBlockUtils";

const COLORS_PER_ROW = 5;

const useStyles = makeStyles(() =>
    createStyles({
        colorsRoot: {
            display: 'grid',
            gridTemplateColumns: `repeat(${COLORS_PER_ROW}, 1fr)`,
            gap: 5,
        },
    })
);

export const ColorSelector: React.FC<IBlockOverflowMenuActionProps> = observer((props) => {
    const { id } = props;
    const [expanded, setExpanded] = React.useState(false);
    const classes = useStyles();
    const handleColorChange = useHighlightBlockColorChanger();

    const colors = React.useMemo(() => 
        MAIN_HIGHLIGHT_COLORS.slice(0, expanded ? MAIN_HIGHLIGHT_COLORS.length : COLORS_PER_ROW), [expanded]);
    const highlightBlockColor = useHighlightBlockColor({ id });

    const toggleExpand = React.useCallback(() => setExpanded(expanded => ! expanded), [setExpanded]);

    const onColorChange = React.useCallback((color: BlockIDStr) =>
        handleColorChange(id, color), [id, handleColorChange]);
    
    return (
        <Box display="flex" alignItems="flex-start" pb={1} px={2}>
            <div className={classes.colorsRoot}>
                {colors.map(color =>
                    <ColorIcon color={color}
                               key={color}
                               active={highlightBlockColor === color}
                               onClick={onColorChange} />
                )}
            </div>
            <Box display="flex"
                 justifyContent="center"
                 alignItems="center"
                 ml={0.625}
                 style={{ cursor: 'pointer' }}
                 onClick={toggleExpand}>

                {expanded 
                    ? <KeyboardArrowUpIcon />
                    : <KeyboardArrowDownIcon />
                }

            </Box>
        </Box>
    );
});

interface IColorIconProps {
    color: ColorStr;
    active?: boolean;
    onClick: (color: ColorStr) => void;
}

interface IColorIconStylesOpts {
    color: ColorStr;
    active: boolean;
}

export const useColorIconStyles = makeStyles<Theme, IColorIconStylesOpts>((theme) =>
    createStyles({
        root: ({ color, active }) => ({
            width: theme.spacing(2.75),
            height: theme.spacing(2.75),
            borderRadius: '50%',
            cursor: 'pointer',
            backgroundColor: color,
            border: active ? '1px solid cyan' : 'none',
        }),
    })
);

export const ColorIcon: React.FC<IColorIconProps> = (props) => {
    const { color, onClick, active = false } = props;
    const classes = useColorIconStyles({ color, active });

    return <div className={classes.root} onClick={() => onClick(color)} />;
};
