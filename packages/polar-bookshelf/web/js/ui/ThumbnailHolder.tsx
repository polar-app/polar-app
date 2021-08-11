import React from "react";
import clsx from "clsx";
import {makeStyles, createStyles} from "@material-ui/core";
import {URLStr} from "page-metadata-parser";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: 3,
            wordBreak: 'break-all',
            textAlign: 'center',
            borderRadius: 10,
            fontFamily: 'Roboto Slab',
            fontSize: '0.875rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            minWidth: 75,
            minHeight: 100,
            width: '100%',
            height: '100%',
            color: 'white',
        },
        imageHolder: {
            backgroundSize: 'cover',
        },
    }),
);

interface IThumnailHolderProps {
    imageURL?: URLStr;
    text?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler;
}

export const ThumbnailHolder: React.FC<IThumnailHolderProps> = (props) => {
    const { text, imageURL, className, style, onClick = NULL_FUNCTION } = props;
    const classes = useStyles();
    const rootClassName = clsx(classes.root, className); 

    if (imageURL) {
        return <div style={{ ...style, backgroundImage: `url(${imageURL})` }}
                    onClick={onClick}
                    className={clsx(rootClassName, classes.imageHolder)} />
    }

    return <div className={rootClassName} style={style} onClick={onClick}>{text}</div>;
};
