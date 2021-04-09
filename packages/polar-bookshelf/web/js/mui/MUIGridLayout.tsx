import React from 'react';
import Grid from "@material-ui/core/Grid";

interface IProps {

    readonly id?: string;
    readonly className?: string;
    readonly style?: React.CSSProperties;

    readonly direction?: 'row' | 'column';

    readonly justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

    readonly alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

    /**
     * Defaults to 1
     */
    readonly spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    /**
     * The wrap of the layout.  Defaults to nowrap.
     */
    readonly wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';

    readonly items: ReadonlyArray<React.ReactElement<any, any>>;

}


/**
 * A layout component better for working with rows or columns.
 *
 *
 */
export const MUIGridLayout = (props: IProps) => {

    const gridProps = {
        id: props.id,
        className: props.className,
        style: props.style,
        direction: props.direction || 'row',
        justify: props.justify || 'flex-start',
        alignItems: props.alignItems || 'center',
        spacing: props.spacing || 1,
        wrap: props.wrap || 'nowrap'
    };

    return (
        <Grid container {...gridProps}>
            {props.items.map(item => (
                <Grid item
                      key={item.key || undefined}>
                    {item}
                </Grid>
            ))}
        </Grid>
    );
};
