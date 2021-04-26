import useTheme from '@material-ui/core/styles/useTheme';
import * as React from 'react';
import {observer} from "mobx-react-lite"
import {BlockIDStr, useBlocksStore } from './store/BlocksStore';

interface IProps {
    readonly id: BlockIDStr;
    readonly children: JSX.Element;
}

export const BlockDragIndicator = observer((props: IProps) => {

    const {dropTarget} = useBlocksStore();

    const theme = useTheme();

    const activeTop = props.id === dropTarget?.id && dropTarget?.pos === 'top';
    const activeBottom = props.id === dropTarget?.id && dropTarget?.pos === 'bottom';

    const style: React.CSSProperties = {

        borderStyle: 'solid',
        borderColor: 'transparent',
        boxSizing: 'border-box',

        // *** top
        borderTopWidth: '2px',
        borderTopColor: activeTop ? theme.palette.primary.main : 'transparent',

        // *** bottom
        borderBottomWidth: '2px',
        borderBottomColor: activeBottom ? theme.palette.primary.main : 'transparent',

    };

    return (
        <div style={style} className="BlockDragIndicator">
            {props.children}
        </div>
    );

});
