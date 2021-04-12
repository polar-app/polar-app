import * as React from 'react';
import { VariableSizeList as List } from 'react-window';
import {DockLayout2} from "../../../web/js/ui/doc_layout/DockLayout2";
import {BrowserRouter} from "react-router-dom";
import {CaptureSizeContainer, useCaptureSizeCalculator} from "../../../web/js/react/CaptureSizeContainer";
import {useDockLayoutResized} from "../../../web/js/ui/doc_layout/DockLayoutStore";
import {useWindowResizeEventListener} from "../../../web/js/react/WindowHooks";
import {IDimensions} from "polar-shared/src/util/IDimensions";

// These row heights are arbitrary.
// Yours should be based on the content of the row.
const rowHeights = new Array(1000)
    .fill(true)
    .map(() => 25 + Math.round(Math.random() * 50));

const getItemSize = (index: number) => rowHeights[index];

interface RowProps {
    readonly index: number;
    readonly style: React.CSSProperties;
}

const Row = (props: RowProps) => (
    <div style={props.style}>Row {props.index}</div>
);

const ReactWindowList = () => {

    const dimensions = useWindowListContainerDimensions();

    return (
        <List height={dimensions.height}
              itemCount={1000}
              itemSize={getItemSize}
              width={dimensions.width}>
            {Row}
        </List>
    );
};

function useWindowResizeDimensions() {

    const calculateDimensions = React.useCallback((): IDimensions => {
        return {
            width: window.outerWidth,
            height: window.outerHeight
        }
    }, []);

    const [state, setState] = React.useState<IDimensions>(() => calculateDimensions());

    useWindowResizeEventListener('react-window-story', () => setState(calculateDimensions()));

    return state;

}

function useWindowListContainerDimensions() {
    const calculator = useCaptureSizeCalculator();
    useDockLayoutResized();
    useWindowResizeDimensions();
    return calculator();
}

const DebugContainerSize = () => {

    const dimensions = useWindowListContainerDimensions();

    return (
        <div style={{
                 position: 'absolute',
                 bottom: '10px',
                 right: '10px'
             }}>
            {dimensions.width}x{dimensions.height}
        </div>
    );

}

const WindowListSidebar = () => {
    return (
        <CaptureSizeContainer style={{flexGrow: 1}}>
            <>
                <ReactWindowList/>
                <DebugContainerSize/>
            </>
        </CaptureSizeContainer>
    )
};

export const ReactWindowStory = () => (

    <DockLayout2.Root dockPanels={[
            {
                id: "doc-panel-outline",
                type: 'fixed',
                side: 'left',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                    flexGrow: 1
                },
                component: (
                    <WindowListSidebar/>
                ),
                width: 410,
            },
            {
                id: "dock-panel-viewer",
                type: 'grow',
                style: {
                    display: 'flex'
                },
                component: (
                    <div>
                        this is just an example
                    </div>
                )
            }
        ]}>
        <DockLayout2.Main/>
    </DockLayout2.Root>


);
