import React from 'react';
import Paper from "@material-ui/core/Paper";

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly children?: JSX.Element | ReadonlyArray<JSX.Element>;
}

/**
 * A toolbar that looks like paper and has proper borders.
 */
export const RepositoryToolbar = (props: IProps) => {
    return (
        <Paper data-test="RepositoryToolbar"
               square
               style={props.style}
               className={ props.className }>

            {props.children || null}
        </Paper>
    )
}
