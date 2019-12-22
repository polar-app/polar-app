import * as React from 'react';
import {MousePositions} from '../dock/MousePositions';
import {Tuples} from "polar-shared/src/util/Tuples";
import {IDStr} from "polar-shared/src/util/Strings";


class Styles {

    public static Dock: React.CSSProperties = {
        display: 'flex',
        flexGrow: 1,
        minHeight: 0
    };

}

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 */
export class DockLayout extends React.Component<IProps, IState> {

    private mousePosition = MousePositions.get();

    private mouseDown: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.markResizing = this.markResizing.bind(this);

        const createFixedDocPanelStateMap = (): FixedDocPanelStateMap => {

            const result: FixedDocPanelStateMap = {};

            for (const docPanel of this.props.dockPanels) {

                if (docPanel.type === 'fixed') {
                    result[docPanel.id] = {
                        id: docPanel.id,
                        width: docPanel.width || 400
                    };
                }

            }

            return result;

        };

        this.state = {
            resizing: undefined,
            panels: createFixedDocPanelStateMap()
        };

    }

    public render() {

        const createSplitter = (resizeTarget: ResizeTarget) => {

            const createSplitterStyle = () => {

                const result: React.CSSProperties = {
                    width: '4px',
                    minWidth: '4px',
                    maxWidth: '4px',
                    cursor: 'col-resize',
                    backgroundColor: 'var(--grey200)',
                    minHeight: 0
                };

                return result;

            };

            const splitterStyle = createSplitterStyle();

            return (
                <div draggable={false}
                     onMouseDown={() => this.onMouseDown(resizeTarget)}
                     style={splitterStyle}>

                </div>
            );
        };


        const createDockPanels = (): ReadonlyArray<JSX.Element> => {

            const tuples = Tuples.createSiblings(this.props.dockPanels);

            const result: JSX.Element[] = [];

            const createBaseStyle = (): React.CSSProperties => {

                const style = {
                    minHeight: 0,
                    overflow: 'auto',
                };

                if (this.state.resizing) {
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

                const panelState = this.state.panels[docPanel.id];

                const {width} = panelState;

                const style: React.CSSProperties = {
                    ...createBaseStyle(),
                    width,
                    maxWidth: width,
                    minWidth: width,
                };

                return (
                    <div className="dock-layout-fixed" style={style} key={idx} id={docPanel.id}>
                        {docPanel.component}
                    </div>
                );

            };

            const createGrowDockPanelElement = (docPanel: GrowDockPanel, idx: number): JSX.Element => {

                const style: React.CSSProperties = {
                    ...createBaseStyle(),
                    flexGrow: docPanel.grow || 1,
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
                    const splitter = createSplitter(resizeTarget);
                    result.push({...splitter, key: tuple.idx});
                }

            }

            return result;

        };

        const docPanels = createDockPanels();

        return (

            <div className="dock-layout"
                 style={{...Styles.Dock}}
                 onMouseMove={() => this.onMouseMove()}
                 draggable={false}>

                {...docPanels}

            </div>

        );
    }

    private onMouseUp() {

        this.mousePosition = MousePositions.get();

        this.markResizing(undefined);
    }

    private onMouseDown(resizeTarget: ResizeTarget) {

        this.mousePosition = MousePositions.get();

        this.markResizing(resizeTarget);

        window.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            this.onMouseUp();
        }, {once: true});

    }

    private markResizing(resizeTarget: ResizeTarget | undefined) {
        this.mouseDown = resizeTarget !== undefined;
        this.setState({...this.state, resizing: resizeTarget});
    }

    private onMouseMove() {

        if (!this.mouseDown) {
            return;
        }

        const lastMousePosition = MousePositions.get();

        const resizeTarget = this.state.resizing!;

        // TODO: this might not be correct with multiple panels
        const mult = resizeTarget.direction === 'left' ? 1 : -1;

        const delta = mult * (lastMousePosition.clientX - this.mousePosition.clientX);

        const panelState = this.state.panels[resizeTarget.id];
        const width = panelState.width + delta;

        const newPanelState = {
            ...panelState,
            width
        };

        const newPanels = {
            ...this.state.panels
        };

        newPanels[resizeTarget.id] = newPanelState;

        this.setState({
            ...this.state,
            panels: newPanels
        });

        this.mousePosition = lastMousePosition;

    }

}

interface IProps {

    /**
     * The configuration of the panels.
     */
    readonly dockPanels: ReadonlyArray<DockPanel>;

}


/**
 * Keeps a map from the ID to the width.
 */
interface FixedDocPanelStateMap {
    [id: string]: FixedDocPanelState;
}

interface FixedDocPanelState {
    readonly id: string;
    readonly width: CSSWidth;
}

interface ResizeTarget {
    readonly id: IDStr;
    readonly direction: 'left' | 'right';
}

interface IState {

    /**
     * The id of the panel we are resizing or undefined if not being resized.
     */
    readonly resizing: ResizeTarget | undefined;

    readonly panels: FixedDocPanelStateMap;

}


/**
 * A CSS width in CSS units (px, em, etc).
 */
// export type CSSWidth = number | string;
export type CSSWidth = number;

export type DocPanelType = 'fixed' | 'grow';

export interface BaseDockPanel {
    readonly id: string;
    readonly type: DocPanelType;
}

export interface FixedDockPanel extends BaseDockPanel {
    readonly type: 'fixed';
    readonly component: JSX.Element;
    readonly width?: CSSWidth;
}

export interface GrowDockPanel extends BaseDockPanel {
    readonly type: 'grow';
    readonly component: JSX.Element;
    readonly grow?: number;
}

export type DockPanel = FixedDockPanel | GrowDockPanel;
