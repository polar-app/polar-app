import React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import useTheme from '@material-ui/core/styles/useTheme';
import grey from '@material-ui/core/colors/grey';

interface IProps {
    readonly onMouseDown: () => void;
}

export const DockSplitter = deepMemo((props: IProps) => {

    const theme = useTheme();
    const [active, setActive] = React.useState(false);

    const createSplitterStyle = React.useCallback(() => {

        const result: React.CSSProperties = {
            width: '4px',
            minWidth: '4px',
            maxWidth: '4px',
            cursor: 'col-resize',
            // backgroundColor: active ?
            //     // TODO darken doesn't work but both paper and default are white
            //     // on light mode
            //     theme.palette.background.default :
            //     theme.palette.background.paper,
            // backgroundColor: grey[500],
            // TODO maybe use the divider color?
            backgroundColor: grey[600],
            minHeight: 0
        };

        return result;

    }, []);

    const splitterStyle = createSplitterStyle();

    return (
        <div draggable={false}
             onMouseDown={() => props.onMouseDown()}
             // onMouseOver={() => setActive(true)}
             // onMouseOut={() => setActive(false)}
             style={splitterStyle}>

        </div>
    );
})
