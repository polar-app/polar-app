import * as React from 'react';
import {MousePositions} from './MousePositions';
import {ChannelCoupler} from '../../js/util/Channels';
import {defaultValue} from '../../js/Preconditions';


class Styles {

    public static Dock: React.CSSProperties = {
        display: 'flex',
        backgroundColor: 'lightgrey',
        flexGrow: 1
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
 *
 *  - need to support persisting state
 *
 *  - to do resize:
 *
 *      https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
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
 *   - flyout mode.
 *
 *   - save state using localStorage.. I could override setState and I could
 *     build a LocalState object which is passed an initialState from props
 *     after and we call this.state = this.localState.hydrate() and the
 *     over loaded setState() calls this.localState
 *
 *        - This could actually be called by composition and have a LocalState
 *          component that restores state of the component via props?
 *
 * // TODO: to make flyout mode... just set position: absolute, height: 100%
 *     and it should work
 *
 *   -  I need a CLEAN way to persist the state for this object in localstorage
 *      and for other components too.
 *
 *   - make sure the dock flows both ways... left and right.
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
        this.setFlyout = this.setFlyout.bind(this);
        this.markResizing = this.markResizing.bind(this);

        if (this.props.toggleCoupler) {
            this.props.toggleCoupler(() => this.toggle());
        }

        if (this.props.setFlyoutCoupler) {
            this.props.setFlyoutCoupler(() => this.setFlyout());
        }


        const mode = this.props.initialMode ? this.props.initialMode : 'expanded';
        const width = this.props.initialWidth || 400;
        const flyout = defaultValue(this.props.initialFlyout, false);

        this.state = {
            mode,
            width,
            resizing: false,
            flyout
        };

    }

    public render() {

        const leftStyle: React.CSSProperties = {};
        const rightStyle: React.CSSProperties = {};

        for (const style of [leftStyle, rightStyle]) {
            style.height = '100%';
        }

        const createSplitterStyle = () => {

            // TODO: might be better to create a map indexed by 'side' and then
            // just read that directly and have all the props enumerated
            // clearly and no if statement.

            const result: React.CSSProperties = {
                width: '10px',
                cursor: 'col-resize',
                backgroundColor: 'orange'
            };

            if (this.props.side === 'left') {
                result.marginLeft = 'auto';
            } else {
                result.marginRight = 'auto';
            }

            return result;

        };

        const splitterStyle = createSplitterStyle();

        const sidebarStyle = this.props.side === 'left' ? leftStyle : rightStyle;
        const contentStyle = this.props.side === 'right' ? leftStyle : rightStyle;

        const width = this.state.mode === 'expanded' ? this.state.width : 0;

        if (this.state.resizing) {

            for (const style of [sidebarStyle, contentStyle]) {
                style.pointerEvents = 'none';
                style.userSelect = 'none';
            }

        }

        if (this.state.flyout) {
            sidebarStyle.position = 'absolute';
        }

        sidebarStyle.width = width;
        contentStyle.flexGrow = 1;

        // needed or the content expands out of the box which isn't what we
        // want.
        sidebarStyle.overflow = 'hidden';

        return (

            <div className="dock"
                 style={{...Styles.Dock, ...this.props.style || {}}}
                 onMouseMove={() => this.onMouseMove()}
                 draggable={false}
                 onMouseUp={() => this.onMouseUp()}>

                <div className="dock-left"
                     style={leftStyle}
                     draggable={false}>

                     {this.props.left}

                </div>

                <div className="dock-splitter"
                     draggable={false}
                     onMouseDown={() => this.onMouseDown()}
                     style={splitterStyle}>

                </div>

                <div className="dock-right"
                     style={contentStyle}
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


    private setFlyout() {

        console.log("setting as flyout ");

        const flyout = ! this.state.flyout;

        const newState = {...this.state, flyout};
        console.log("newState: ", newState);
        this.setState(newState);

    }


}

interface IProps {

    readonly style?: React.CSSProperties;

    readonly initialMode?: DockMode;

    readonly initialWidth?: number;

    readonly initialFlyout?: boolean;

    readonly side: DockSide;

    readonly left: JSX.Element;

    readonly right: JSX.Element;

    readonly toggleCoupler?: ChannelCoupler<void>;

    readonly setFlyoutCoupler?: ChannelCoupler<void>;

}

interface IState {

    readonly mode: DockMode;

    readonly width: number;

    /**
     * True when we're in the middle of resizing the dock.
     */
    readonly resizing: boolean;

    readonly flyout: boolean;

}

/**
 * The DocMode specifies which side is expanded by default (the right or left).
 */
export type DockSide = 'left' | 'right';

export type DockMode = 'expanded' | 'collapsed';
