import * as React from 'react';
import {MousePositions} from '../dock/MousePositions';
import {Tuples} from "polar-shared/src/util/Tuples";


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

        this.state = {
            resizing: false,
        };

    }

    public render() {

        const leftStyle: React.CSSProperties = {};
        const rightStyle: React.CSSProperties = {};

        for (const style of [leftStyle, rightStyle]) {
            style.overflow = 'auto';
            style.flexGrow = 1;
            style.minHeight = 0;
        }

        const createSplitter = () => {


            const createSplitterStyle = () => {

                // TODO: might be better to create a map indexed by 'side' and then
                // just read that directly and have all the props enumerated
                // clearly and no if statement.

                const result: React.CSSProperties = {
                    width: '4px',
                    minWidth: '4px',
                    maxWidth: '4px',
                    cursor: 'col-resize',
                    backgroundColor: 'var(--grey200)',
                    minHeight: 0
                };

                // if (this.props.side === 'left') {
                //     result.marginLeft = 'auto';
                // } else {
                //     result.marginRight = 'auto';
                // }

                return result;

            };

            const splitterStyle = createSplitterStyle();

            return (
                <div draggable={false}
                     onMouseDown={() => this.onMouseDown()}
                     style={splitterStyle}>

                </div>
            );
        };


        const createDockPanels = (): ReadonlyArray<JSX.Element> => {

            const tuples = Tuples.createSiblings(this.props.dockPanels);

            const result: JSX.Element[] = [];

            const createFixedDockPanelElement = (docPanel: FixedDockPanel, idx: number): JSX.Element => {

                const style: React.CSSProperties = {
                    width: docPanel.width,
                    maxWidth: docPanel.width,
                    minWidth: docPanel.width
                };


                return (
                    <div style={style} key={idx}>
                        {docPanel.component}
                    </div>
                );

            };

            const createGrowDockPanelElement = (docPanel: GrowDockPanel, idx: number): JSX.Element => {

                const style: React.CSSProperties = {
                    flexGrow: docPanel.grow
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

                if  (tuple.next !== undefined) {
                    const splitter = createSplitter();
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

        // console.log("up");

        this.mousePosition = MousePositions.get();

        this.markResizing(false);
    }

    private onMouseDown() {

        this.mousePosition = MousePositions.get();

        this.markResizing(true);

        window.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            this.onMouseUp();
        }, {once: true});

    }

    private markResizing(resizing: boolean) {
        this.mouseDown = resizing;
        this.setState({...this.state, resizing});
    }

    private onMouseMove() {
        // console.log("move");

        if (!this.mouseDown) {
            return;
        }

        // const lastMousePosition = MousePositions.get();
        //
        // const mult = this.props.side === 'left' ? 1 : -1;
        //
        // const delta = mult * (lastMousePosition.clientX - this.mousePosition.clientX);
        //
        // const width = this.state.width + delta;
        //
        // this.setState({...this.state, width});
        //
        // this.mousePosition = lastMousePosition;

    }

}

interface IProps {

    readonly dockPanels: ReadonlyArray<DockPanel>;

}

interface IState {

    /**
     * True when we're in the middle of resizing the dock.
     */
    readonly resizing: boolean;

}

/**
 * A CSS width in CSS units (px, em, etc).
 */
export type CSSWidth = string;

export interface BaseDockPanel {
    readonly id: string;
}

export interface FixedDockPanel extends BaseDockPanel {
    readonly type: 'fixed';
    readonly component: JSX.Element;
    readonly width: number | CSSWidth;
}

export interface GrowDockPanel extends BaseDockPanel {
    readonly type: 'grow';
    readonly component: JSX.Element;
    readonly grow: number;
}

export type DockPanel = FixedDockPanel | GrowDockPanel;
