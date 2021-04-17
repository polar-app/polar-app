import * as React from 'react';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
    readonly children: React.ReactNode;
}

/**
 * Provide enough margin so scrolling can never obscure the feedback button
 */
export const FeedbackPadding = deepMemo(function FeedbackPadding(props: IProps) {

    const theme = useTheme();
    return (
        <div style={{paddingBottom: theme.spacing(8)}}>
            {props.children}
        </div>
    )

})
