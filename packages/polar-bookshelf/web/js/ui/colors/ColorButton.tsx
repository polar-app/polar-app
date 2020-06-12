import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        selected: {
            border: `2px solid ${theme.palette.info.dark}`
        },

        notSelected: {
            border: '2px solid rgba(0, 0, 0, 0.1)'
        }

    })
);


/**
 * RGB color in the a CSS color.
 */
export type RGBColor = string;

interface IProps {
    readonly color: RGBColor;
    readonly size?: string;
    readonly id?: string;
    readonly selected?: boolean;
    readonly onSelected?: (color: string) => void;
}

export const ColorButton = (props: IProps) => {

    const classes = useStyles();

    const createBackgroundColor = () => {

        switch (props.color) {

            case 'yellow':
                return 'rgba(255,255,0)';
            case 'red':
                return 'rgba(255,0,0)';
            case 'green':
                return 'rgba(0,255,0)';
            default:
                return props.color;
        }

    };

    const backgroundColor = createBackgroundColor();

    const onSelected = props.onSelected || NULL_FUNCTION;

    const size = props.size || '30px';

    const buttonClassName = props.selected ? classes.selected : classes.notSelected;

    return <div className="ml-1 mr-1"
                style={{
                    display: 'flex',
                }}>
        <button id={props.id}
                className={buttonClassName}
                title=""
                aria-label=""
                onClick={() => onSelected(props.color)}
                style={{
                    backgroundColor,
                    width: size,
                    height: size
                }}>

        </button>
    </div>;

}

