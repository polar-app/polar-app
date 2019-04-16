import * as React from 'react';
import {MousePositions} from './MousePositions';


class Styles {

    public static Dock: React.CSSProperties = {
        display: 'flex',
        height: '100%',
        backgroundColor: 'lightgrey'
    };

}

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 * Features
 *
 * - menu items directly specified so we can show JUST the icons
 *
 * - support for an additional control for more advanced navigation.  For
 * example we could stuff in a tree control.
 *
 * - Keep the dock persistent.
 *
 * TODO:
 *
 *  - need a way to expose a button to expand / collapse the dock
 *
 *  - need to support resize
 *
 *  - need to support persisting state
 *
 *  - to do resize:
 *
 *  https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
 *
 *  - this MIGHT require window mouse event listeners which is not fun...
 *
 *  TODO:
 *   - screw it... Ic an just use THIS component:
 *    - http://alexkuz.github.io/react-dock/demo/
 *
 *    - and wrap it ?? with a 'permanently' docked mode?  The problem is I need
 *      a way to resize once it's permanently docked.
 *
 *    - one thing I could do is just make the even listeners static/permanent
 *      for the entire app and they never get removed we just update the
 *      position.
 *
 */
export class Dock extends React.Component<IProps, IState> {

    private mousePosition = MousePositions.get();

    private mouseDown: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);


        this.state = {
            mode: this.props.initialMode ? this.props.initialMode : 'expanded',
            width: this.props.initialWidth || 400
        };

    }

    public render() {

        const leftStyle: React.CSSProperties = {};
        const rightStyle: React.CSSProperties = {};

        // const width = typeof this.state.width === 'number' ? `${this.props.width}px` : this.props.width;
        const width = this.state.width;

        const sidebarStyle = this.props.side === 'left' ? leftStyle : rightStyle;
        const contentStyle = this.props.side !== 'left' ? leftStyle : rightStyle;

        sidebarStyle.width = width;

        contentStyle.width = `calc(100% - ${width})`;

        return (

            <div className="dock" style={Styles.Dock}
                 onMouseMove={() => this.onMouseMove()}
                 onMouseUp={() => this.onMouseUp()}>

                <div className="dock-left" style={leftStyle}>
                    {this.props.left}
                </div>

                <div className="dock-splitter"
                     onMouseDown={() => this.onMouseDown()}
                     style={{
                         width: '10px',
                         cursor: 'col-resize',
                         backgroundColor: 'orange'
                     }}>

                </div>

                <div className="dock-right" style={contentStyle}>
                    {this.props.right}
                </div>

            </div>

        );
    }

    private onMouseUp() {

        console.log("up");

        this.mouseDown = false;
        this.mousePosition = MousePositions.get();
    }

    private onMouseDown() {

        this.mouseDown = true;

        console.log("down");
        this.mousePosition = MousePositions.get();
    }

    private onMouseMove() {
        console.log("move");

        if (!this.mouseDown) {
            return;
        }

        const lastMousePosition = MousePositions.get();

        const delta = lastMousePosition.clientX - this.mousePosition.clientX;

        const width = this.state.width + delta;

        this.setState({...this.state, width});

        this.mousePosition = lastMousePosition;

    }

}

interface IProps {

    readonly initialMode?: DockMode;

    readonly initialWidth?: number;

    readonly side: DockSide;

    readonly left: JSX.Element;

    readonly right: JSX.Element;

}

interface IState {
    readonly mode: DockMode;
    readonly width: number;

}

/**
 * The DocMode specifies which side is expanded by default (the right or left).
 */
export type DockSide = 'left' | 'right';

export type DockMode = 'expanded' | 'collapsed';
