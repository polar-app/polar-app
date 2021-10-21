import * as React from 'react';
import {Tuples} from "polar-shared/src/util/Tuples";
import {IDStr} from "polar-shared/src/util/Strings";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DockSplitter} from "./DockSplitter";
import {deepMemo} from "../../react/ReactUtils";
import {useStateRef} from "../../hooks/ReactHooks";
import {useDockLayoutCallbacks, useDockLayoutStore} from './DockLayoutStore';
import {Point} from 'polar-shared/src/util/Point';
import {Debouncers} from 'polar-shared/src/util/Debouncers';

class Styles {

    public static Dock: React.CSSProperties = {
        display: 'flex',
        flexGrow: 1,
        minHeight: 0
    };

}

export interface DocLayoutProps {
    readonly dockPanels: ReadonlyArray<DockPanel>;
    readonly onResize?: Callback;
}

function getMousePositionFromEvent(event: React.TouchEvent | TouchEvent, type: 'touch'): Point;
function getMousePositionFromEvent(event: React.MouseEvent | MouseEvent, type: 'mouse'): Point;
function getMousePositionFromEvent(event: any, type: any): Point {
    if (type === 'touch') {
        const [{ clientX, clientY }] = event.touches;
        return { x: clientX, y: clientY };
    } else {
        const { clientX, clientY } = event;
        return { x: clientX, y: clientY };
    }
};

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 */
export const DockLayoutManager = deepMemo(function DockLayoutManager() {

    const mousePosition = React.useRef<Point>({ x: 0, y: 0 });
    const realtimeMousePosition = React.useRef<Point>({ x: 0, y: 0 });
    const mouseDown = React.useRef(false);
    const {panels, onResize, dockPanels} = useDockLayoutStore(['panels', 'onResize', 'dockPanels']);
    const {setPanels} = useDockLayoutCallbacks();

    const [, setState, stateRef] = useStateRef<IState>({
        resizing: undefined,
    });

    const markResizing = React.useCallback((resizeTarget: ResizeTarget | undefined) => {

        const toggleUserSelect = (resizing: boolean) => {
            // this is a hack to disable user select of the document to prevent
            // parts of the UI from being selected

            if (resizing) {
                document.body.style.userSelect = 'none';
            } else {
                document.body.style.userSelect = 'auto';
            }

        };

        toggleUserSelect(resizeTarget !== undefined);

        mouseDown.current = resizeTarget !== undefined;
        setState({...stateRef.current, resizing: resizeTarget});

    }, [setState, stateRef]);


    const onFinish = React.useCallback(() => {
        markResizing(undefined);
    }, [markResizing]);

    const onStart = React.useCallback((position: Point, resizeTarget: ResizeTarget, type: 'touch' | 'mouse') => {

        mousePosition.current = position;

        markResizing(resizeTarget);

        if (type === 'mouse') {
            window.addEventListener('mouseup', onFinish, { once: true });
        } else {
            window.addEventListener('touchend', onFinish, { once: true });
        }

    }, [markResizing, onFinish]);

    const onMove = React.useCallback(() => {

        if (! mouseDown.current) {
            return;
        }

        const position = realtimeMousePosition.current;

        const resizeTarget = stateRef.current.resizing!;

        // TODO: this might not be correct with multiple panels
        const mult = resizeTarget.direction === 'left' ? 1 : -1;

        const delta = mult * (position.x - mousePosition.current.x);

        const panelState = panels[resizeTarget.id];
        const width = panelState.width + delta;

        const newPanelState = {
            ...panelState,
            width
        };

        const newPanels = {
            ...panels
        };

        newPanels[resizeTarget.id] = newPanelState;

        (onResize || NULL_FUNCTION)();

        setPanels(newPanels);

        mousePosition.current = position;

    }, [stateRef, panels, onResize, setPanels]);

    React.useEffect(() => {
        const onMouseMove = (e: MouseEvent) => realtimeMousePosition.current = getMousePositionFromEvent(e, 'mouse');
        const onTouchMove = (e: TouchEvent) => realtimeMousePosition.current = getMousePositionFromEvent(e, 'touch');

        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        return () => {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [onMove]);

    const handleMove = React.useMemo(() => Debouncers.create(onMove), [onMove])

    const createDockPanels = React.useCallback((): ReadonlyArray<JSX.Element> => {

        const tuples = Tuples.createSiblings(dockPanels.filter(current => ! current.disabled));

        const result: JSX.Element[] = [];

        const createBaseStyle = (): React.CSSProperties => {

            const style = {
                overflow: 'auto',
            };

            if (stateRef.current.resizing) {
                return {
                    ...style,
                    pointerEvents: 'none',
                    userSelect: 'none'
                };
            } else {
                return style;
            }

        };

        const createFixedDockPanelElement = (docPanel: FixedDockPanel, idx: number): JSX.Element => {

            const panel = panels[docPanel.id];

            const width = panel.collapsed ? 0 : panel.width;

            const baseStyle = createBaseStyle();
            const docPanelStyle = (docPanel.style || {});

            const display = panel.collapsed ? 'none' : (baseStyle.display || docPanelStyle.display || 'block');
            const style: React.CSSProperties = {
                ...baseStyle,
                width,
                maxWidth: width,
                minWidth: width,
                ...docPanelStyle,
                display
            };

            return (
                <div className="dock-layout-fixed"
                     style={style}
                     key={idx}
                     id={docPanel.id}>

                    {docPanel.component}

                </div>
            );

        };

        const createGrowDockPanelElement = (docPanel: GrowDockPanel, idx: number): JSX.Element => {

            const style: React.CSSProperties = {
                ...createBaseStyle(),
                flexGrow: docPanel.grow || 1,
                ...(docPanel.style || {})
            };

            return (
                <div className="dock-layout-grow" style={style} key={idx} id={docPanel.id}>
                    {docPanel.component}
                </div>
            );

        };

        const createDocPanelElement = (docPanel: DockPanel, idx: number): JSX.Element => {

            if (docPanel.type === 'fixed') {
                return createFixedDockPanelElement(docPanel, idx);
            }

            return createGrowDockPanelElement(docPanel, idx);

        };

        for (const tuple of tuples) {

            result.push(createDocPanelElement(tuple.curr, tuple.idx));

            const computeResizeTarget = (): ResizeTarget => {

                if (tuple.curr.type === 'fixed') {
                    return {
                        id: tuple.curr.id,
                        direction: 'left'
                    };
                }

                return {
                    id: tuple.next!.id,
                    direction: 'right'
                };

            };

            if  (tuple.next !== undefined) {
                const resizeTarget = computeResizeTarget();
                const splitter = (
                    <DockSplitter key={'splitter-' + tuple.idx}
                                  onMouseDown={e => onStart(getMousePositionFromEvent(e, 'mouse'), resizeTarget, 'mouse')}
                                  onTouchStart={e => onStart(getMousePositionFromEvent(e, 'touch'), resizeTarget, 'touch')}/>
                );
                result.push(splitter);
            }

        }


        return result;

    }, [onStart, panels, dockPanels, stateRef]);

    const docPanels = createDockPanels();

    return (

        <div className="dock-layout"
             style={{...Styles.Dock}}
             onMouseMove={() => handleMove()}
             onTouchMove={() => handleMove()}
             draggable={false}>

            {...docPanels}

        </div>

    );

});

/**
 * Keeps a map from the ID to the width.
 */
export interface FixedDocPanelStateMap {
    [id: string]: FixedDocPanelState;
}

export interface FixedDocPanelState {
    readonly id: string;
    readonly width: CSSWidth;
    readonly side: SideType | undefined;

    /**
     * True if a given side is collapsed and should be rendered with zero width.
     */
    readonly collapsed: boolean;

}

export interface ResizeTarget {
    readonly id: IDStr;
    readonly direction: 'left' | 'right';
}

interface IState {

    /**
     * The id of the panel we are resizing or undefined if not being resized.
     */
    readonly resizing: ResizeTarget | undefined;

}

/**
 * A CSS width in CSS units (px, em, etc).
 */
export type CSSWidth = number;

export type SideType = 'left' | 'right';

export type DocPanelType = 'fixed' | 'grow';

export interface BaseDockPanel {
    readonly id: string;
    readonly type: DocPanelType;
    readonly disabled?: boolean;
    readonly style?: React.CSSProperties;
}

export interface FixedDockPanel extends BaseDockPanel {
    readonly type: 'fixed';
    readonly component: JSX.Element;
    readonly width?: CSSWidth;
    readonly collapsed?: boolean;

    /**
     * Specify which side this dock is so that we can easily toggle.
     */
    readonly side?: SideType;
}

export interface GrowDockPanel extends BaseDockPanel {
    readonly type: 'grow';
    readonly component: JSX.Element;
    readonly grow?: number;
}

export type DockPanel = FixedDockPanel | GrowDockPanel;

