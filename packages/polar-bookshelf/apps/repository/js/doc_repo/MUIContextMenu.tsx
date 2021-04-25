import React, {useState} from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Menu from "@material-ui/core/Menu";
import {IPoint} from "../../../../web/js/Point";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export namespace MouseEvents {
    export function fromNativeEvent(event: MouseEvent): IMouseEvent {
        return {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            target: event.target,
            nativeEvent: event,
            preventDefault: event.preventDefault.bind(event),
            stopPropagation: event.stopPropagation.bind(event),
            getModifierState: event.getModifierState.bind(event),
        };
    }
}

/**
 * Used so that we can use either the native mouse events or the react ones.
 */
export interface IMouseEvent {

    readonly clientX: number;
    readonly clientY: number;
    readonly pageX: number;
    readonly pageY: number;
    readonly target: EventTarget | null;

    readonly nativeEvent: MouseEvent;

    preventDefault(): void;
    stopPropagation(): void;
    getModifierState(key: string): boolean;

}

type OnContextMenuCallback = (event: IMouseEvent) => void;

interface IContextMenuCallbacks {
    readonly onContextMenu: OnContextMenuCallback;
}

export const ContextMenuContext
    = React.createContext<IContextMenuCallbacks>({onContextMenu: NULL_FUNCTION});

interface IContextMenuProps {
    readonly children: React.ReactNode;
    readonly anchorEl?: HTMLElement;
    readonly disabled?: boolean;
}

/**
 * Interface describing where the original context menu was created.
 */
export interface IEventOrigin {

    readonly pageX: number;
    readonly pageY: number;

    readonly clientX: number;
    readonly clientY: number;

    readonly offsetX: number;
    readonly offsetY: number;

}

export interface MenuComponentProps<O> {
    readonly origin: O | undefined;
    readonly disabled?: boolean;
}

export function computeEventOrigin(event: React.MouseEvent<HTMLElement>): IEventOrigin {

    const origin: IEventOrigin = {
        pageX: event.pageX,
        pageY: event.pageY,

        clientX: event.clientX,
        clientY: event.clientY,

        offsetX: (event as any).offsetX,
        offsetY: (event as any).offsetY,
    }

    return origin;

}

interface CreateContextMenuOpts<O> {

    /**
     * Create a new origin object that's custom that we can use
     */
    readonly computeOrigin?: (event: IMouseEvent) => O | undefined;

}

function computeMenuPoint(event: IMouseEvent): IPoint {

    function computeOffsets(): IPoint {

        if (event.nativeEvent.view && event.nativeEvent.view.frameElement) {
            const bcr = event.nativeEvent.view.frameElement.getBoundingClientRect();

            return {
                x: bcr.left,
                y: bcr.top
            };

        }

        return {
            x: 0,
            y: 0
        };

    }

    const offsets = computeOffsets();

    const buffer = {
        x: -2,
        y: -4
    };

    return {
        x: event.clientX + offsets.x + buffer.x,
        y: event.clientY + offsets.y + buffer.y
    };

}

/**
 *
 * @Deprecated use MUIContextMenu2
 */
export function createContextMenu<O>(MenuComponent: (props: MenuComponentProps<O>) => JSX.Element | null,
                                     opts: CreateContextMenuOpts<O> = {}): (props: IContextMenuProps) => JSX.Element {

    return (props: IContextMenuProps): JSX.Element => {

        interface IContextMenuActive {
            readonly mouseX: number;
            readonly mouseY: number;

            readonly origin: O | undefined;
        }

        const [active, setActive] = useState<IContextMenuActive | undefined>(undefined);

        const onContextMenu = React.useCallback((event: IMouseEvent): void => {

            event.stopPropagation();
            event.preventDefault();

            const origin = opts.computeOrigin ?  opts.computeOrigin(event) : undefined;

            const menuPoint = computeMenuPoint(event);

            const newActive = {
                mouseX: menuPoint.x,
                mouseY: menuPoint.y,
                origin
            };

            setActive(newActive);

        }, []);

        const handleClose = React.useCallback(() => {
            setActive(undefined);
        }, [])

        return (
            <ContextMenuContext.Provider value={{onContextMenu}}>

                {active &&
                <MUIContextMenu {...active}
                                anchorEl={props.anchorEl}
                                handleClose={handleClose}>
                    <MenuComponent disabled={props.disabled} origin={active.origin}/>
                </MUIContextMenu>}

                {props.children}

            </ContextMenuContext.Provider>
        );
    };

}

/**
 *
 * @Deprecated use MUIContextMenu2
 */
export function useContextMenu(opts: Partial<IContextMenuCallbacks> = {}): IContextMenuCallbacks {

    const contextMenuCallbacks = React.useContext(ContextMenuContext);

    const onContextMenu = React.useCallback((event: IMouseEvent) => {
        const parent = opts.onContextMenu || NULL_FUNCTION;
        parent(event);

        contextMenuCallbacks.onContextMenu(event);

    }, [contextMenuCallbacks, opts]);

    return {onContextMenu};

}

interface MUIContextMenuProps {

    readonly mouseX: number;
    readonly mouseY: number;

    /**
     * Callback that should be called when we want to close the menu.
     */
    readonly handleClose: () => void;

    /**
     * Where to anchor the menu.
     */
    readonly anchorEl?: HTMLElement;

    readonly children: React.ReactFragment | JSX.Element;

}

export const MUIContextMenu = deepMemo(function MUIContextMenu(props: MUIContextMenuProps) {

    const handleClose = React.useCallback(() => {
        props.handleClose();
    }, [props])

    function handleContextMenu(event: React.MouseEvent) {
        // needed so that you can't bring up a native context menu on a context
        // menu
        event.preventDefault();
    }

    return (
        <Menu
            transitionDuration={0}
            keepMounted
            anchorEl={props.anchorEl}
            open={true}
            onClose={handleClose}
            onClick={handleClose}
            onContextMenu={handleContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={{
                top: props.mouseY,
                left: props.mouseX
            }}>

            <div>
                {props.children}
            </div>

        </Menu>
    );
});
