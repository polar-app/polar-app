import * as React from 'react';
import {MousePositions} from './MousePositions';
import {ChannelCoupler} from '../../js/util/Channels';


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
 *
 * - Keep the dock persistent by using localStorage prefs
 *
 * TODO:
 *
 *  - need a way to expose a button to expand / collapse the dock.  Toggle it...
 *
 *  - need to support persisting state
 *
 *  - to do resize:
 *
 *  https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
 *
 *  - this MIGHT require window mouse event listeners which is not fun...
 *
 * - menu items directly specified so we can show JUST the icons in the sidebar
 *   as a 'mode'.  TODO.. might be better if this was sort of a sub-component
 *   or we implemented this via composition.
 *
 *
 *  TODO:
 *
 *   - if the user leaves the window, does mouse up, then comes back in, the
 *     dock is still in resize mode.
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
        this.toggle = this.toggle.bind(this);
        this.markResizing = this.markResizing.bind(this);

        if (this.props.toggleCoupler) {
            this.props.toggleCoupler(() => this.toggle());
        }

        this.state = {
            mode: this.props.initialMode ? this.props.initialMode : 'expanded',
            width: this.props.initialWidth || 400,
            resizing: false
        };

    }

    public render() {

        const leftStyle: React.CSSProperties = {};
        const rightStyle: React.CSSProperties = {};

        const width = this.state.mode === 'expanded' ? this.state.width : 0;

        const sidebarStyle = this.props.side === 'left' ? leftStyle : rightStyle;
        const contentStyle = this.props.side === 'right' ? leftStyle : rightStyle;

        if (this.state.resizing) {

            for (const style of [sidebarStyle, contentStyle]) {
                style.pointerEvents = 'none';
                style.userSelect = 'none';
            }

        }

        sidebarStyle.width = width;
        // contentStyle.width = `calc(100% - ${width})`;

        contentStyle.flexGrow = 1;

        // needed or the content expands out of the box which isn't what we
        // want.
        sidebarStyle.overflow = 'hidden';

        return (

            <div className="dock" style={Styles.Dock}
                 onMouseMove={() => this.onMouseMove()}
                 draggable={false}
                 onMouseUp={() => this.onMouseUp()}>

                <div className="dock-left"
                     style={leftStyle}
                     draggable={false}>
                     onDrag={() => console.log("being dragged left")}

                     {this.props.left}

                </div>

                <div className="dock-splitter"
                     draggable={false}
                     onDrag={() => console.log("being dragged splitter")}
                     onMouseDown={() => this.onMouseDown()}
                     onDragStart={() => {
                         console.log("FIXME: onDragStart");
                         return false;
                     }}
                     style={{
                         width: '10px',
                         cursor: 'col-resize',
                         backgroundColor: 'orange'
                     }}>

                </div>

                <div className="dock-right"
                     style={contentStyle}
                     onDrag={() => console.log("being dragged right")}
                     draggable={false}>
                    {this.props.right}
                </div>

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

        const lastMousePosition = MousePositions.get();

        const delta = lastMousePosition.clientX - this.mousePosition.clientX;

        const width = this.state.width + delta;

        this.setState({...this.state, width});

        this.mousePosition = lastMousePosition;

    }

    private toggle() {

        const newMode = () => {

            switch (this.state.mode) {

                case 'expanded':
                    return 'collapsed';
                case 'collapsed':
                    return 'expanded';

            }

        };

        const mode = newMode();

        this.setState({...this.state, mode});

    }

}

interface IProps {

    readonly initialMode?: DockMode;

    readonly initialWidth?: number;

    readonly side: DockSide;

    readonly left: JSX.Element;

    readonly right: JSX.Element;

    readonly toggleCoupler?: ChannelCoupler<void>;

}

interface IState {

    readonly mode: DockMode;

    readonly width: number;

    /**
     * True when we're in the middle of resizing the dock.
     */
    readonly resizing: boolean;
}

/**
 * The DocMode specifies which side is expanded by default (the right or left).
 */
export type DockSide = 'left' | 'right';

export type DockMode = 'expanded' | 'collapsed';
