import * as React from 'react';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
    readonly children: React.ReactNode;
}

/**
 * Provide enough margin so scrolling can never obscure the feedback button
 */
export const FeedbackMargin = deepMemo((props: IProps) => {

    const theme = useTheme();
    return (
        <div style={{marginBottom: theme.spacing(8)}}>
            {props.children}
        </div>
    )

})