import {createStyles, makeStyles} from "@material-ui/core";
import {IBlockLink} from "polar-blocks/src/blocks/IBlock";
import React from "react";
import {ColorStr} from "../../../ui/colors/ColorSelectorBox";

interface IProps {
    color?: ColorStr;
}

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'stretch',
        },
        color: {
            marginRight: 8,
            flexGrow: 0,
            width: 4,
            borderRadius: 2,
            flex: '0 0 4px',
            backgroundColor: 'yellow', // default color
        },
        content: {
            flex: 1,
        },
    }),
);

export const BlockHighlightContentWrapper: React.FC<IProps> = ({ color, children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.color} style={{ backgroundColor: color }} />
            <div className={classes.content} children={children} />
        </div>
    );
};


interface IBlockTagsSectionProps {
    links: ReadonlyArray<IBlockLink>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const useBlockTagsSectionStyles = makeStyles(() =>
    createStyles({
        root: {
            margin: '3px 0',
            '& > a': {
                marginRight: 4,
                fontSize: 12,
                whiteSpace: 'nowrap',
            }
        },
    }),
);

export const BlockTagsSection: React.FC<IBlockTagsSectionProps> = ({ links, onClick }) => {
    const classes = useBlockTagsSectionStyles();

    return (
        <div className={classes.root} onClick={onClick}>
            {links.map(({ text, id }, i) => 
                <a href={`${text}`} className="note-tag" key={`${id}-${i}`}>{text}</a>
            )}
        </div>
    );
};
