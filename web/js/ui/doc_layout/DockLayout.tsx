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
                        width: docPanel.width
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

        const createSplitter = (resizePanelID: string) => {

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
                     onMouseDown={() => this.onMouseDown(resizePanelID)}
                     style={splitterStyle}>

                </div>
            );
        };


        const createDockPanels = (): ReadonlyArray<JSX.Element> => {

            const tuples = Tuples.createSiblings(this.props.dockPanels);

            const result: JSX.Element[] = [];

            const createFixedDockPanelElement = (docPanel: FixedDockPanel, idx: number): JSX.Element => {

                const panelState = this.state.panels[docPanel.id];

                const {width} = panelState;

                const style: React.CSSProperties = {
                    width,
                    maxWidth: width,
                    minWidth: width,
                    minHeight: 0
                };


                return (
                    <div style={style} key={idx}>
                        {docPanel.component}
                    </div>
                );

            };

            const createGrowDockPanelElement = (docPanel: GrowDockPanel, idx: number): JSX.Element => {

                const style: React.CSSProperties = {
                    flexGrow: docPanel.grow,
                    minHeight: 0
                };

                return (
                    <div style={style} key={idx}>
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


                const computeResizePanelID = () => {

                    if (tuple.curr.type === 'fixed') {
                        return tuple.curr.id;
                    }

                    return tuple.next!.id;

                };

                if  (tuple.next !== undefined) {
                    const resizePanelID = computeResizePanelID();
                    const splitter = createSplitter(resizePanelID);
                    result.push({...splitter, key: tuple.idx});
                }

            }

            return result;

        };

        // if (this.state.resizing) {
        //
        //     for (const style of [sidebarStyle, contentStyle]) {
        //         style.pointerEvents = 'none';
        //         style.userSelect = 'none';
        //     }
        //
        // }
        //

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

    private onMouseDown(resizePanelID: string) {

        this.mousePosition = MousePositions.get();

        this.markResizing(resizePanelID);

        window.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            this.onMouseUp();
        }, {once: true});

    }

    private markResizing(resizePanelID: IDStr | undefined) {
        this.mouseDown = resizePanelID !== undefined;
        this.setState({...this.state, resizing: resizePanelID});
    }

    private onMouseMove() {

        if (!this.mouseDown) {
            return;
        }

        const lastMousePosition = MousePositions.get();

        const mult = 1; // FIXME: this might need fixing.

        const delta = mult * (lastMousePosition.clientX - this.mousePosition.clientX);

        const resizePanelID = this.state.resizing!;

        const panelState = this.state.panels[resizePanelID];
        const width = panelState.width + delta;

        const newPanelState = {
            ...panelState,
            width
        };

        const newPanels = {
            ...this.state.panels
        };

        newPanels[resizePanelID] = newPanelState;

        this.setState({
            ...this.state,
            panels: newPanels
        });

        this.mousePosition = lastMousePosition;

    }

}

interface IProps {

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

interface IState {

    /**
     * The id of the panel we are resizing or undefined if not being resized.
     */
    readonly resizing: IDStr | undefined;

    readonly panels: FixedDocPanelStateMap;

}


/**
 * A CSS width in CSS units (px, em, etc).
 */
// export type CSSWidth = number | string;
export type CSSWidth = number;

export interface BaseDockPanel {
    readonly id: string;
}

export interface FixedDockPanel extends BaseDockPanel {
    readonly type: 'fixed';
    readonly component: JSX.Element;
    readonly width: CSSWidth;
}

export interface GrowDockPanel extends BaseDockPanel {
    readonly type: 'grow';
    readonly component: JSX.Element;
    readonly grow: number;
}

export type DockPanel = FixedDockPanel | GrowDockPanel;
