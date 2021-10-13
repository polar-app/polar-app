import * as React from "react";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import IconButton from "@material-ui/core/IconButton";

interface IProps {
    readonly size?: 'small' | 'medium'
}

export const PagePrevButton = React.memo(function PagePrevButton(props: IProps) {

    const {onPagePrev} = useDocViewerCallbacks();
    const {pageNavigator, page} = useDocViewerStore(['pageNavigator', 'page']);

    return (
        <IconButton size={props.size || 'small'}
                    disabled={!pageNavigator || page <= 1}
                    onClick={onPagePrev}>
            <ArrowUpwardIcon/>
        </IconButton>
    );

});
