import * as React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Menu from "@material-ui/core/Menu";
import {IPoint} from "../../../../web/js/Point";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {createContextMenuStore} from "./MUIContextMenuStore";
import useLongPress from "../../../../web/js/hooks/UseLongPress";
import { observer } from "mobx-react-lite"

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

    readonly nativeEvent: MouseEvent | TouchEvent;

    preventDefault(): void;
    stopPropagation(): void;
    getModifierState(key: string): boolean;

}

type OnContextMenuCallback = (event: IMouseEvent) => void;

interface IContextMenuCallbacks {
    readonly onContextMenu: OnContextMenuCallback;
}

interface IContextMenuContext<O> {
    readonly computeOrigin?: (event: IMouseEvent) => O | undefined;
}

export const ContextMenuContext = React.createContext<IContextMenuContext<any>>({computeOrigin: NULL_FUNCTION});

interface IContextMenuProps {
    readonly children: React.ReactNode;
    readonly anchorEl?: HTMLElement;
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
     * The name of this context menu (for debug purposes primarily).
     */
    readonly name: string;

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

export type ContextMenuProviderComponent = (props: IContextMenuProps) => JSX.Element;

export type UseContextMenuHook = (opts?: Partial<IContextMenuCallbacks>) => IContextMenuCallbacks;

export type CreateContextMenuTuple = [ContextMenuProviderComponent, UseContextMenuHook];

export function createContextMenu<O>(MenuComponent: (props: MenuComponentProps<O>) => JSX.Element | null,
                                     opts: CreateContextMenuOpts<O>): CreateContextMenuTuple {

    const [MUIContextMenuStoreProvider, useMUIContextMenuStore] = createContextMenuStore<O>();

    const {name} = opts;

    const useContextMenu = (opts: Partial<IContextMenuCallbacks> = {}): IContextMenuCallbacks => {

        const store = useMUIContextMenuStore();

        const {computeOrigin} = React.useContext(ContextMenuContext);

        const onContextMenu = React.useCallback((event: IMouseEvent) => {

            const parent = opts.onContextMenu || NULL_FUNCTION;
            parent(event);

            event.stopPropagation();
            event.preventDefault();

            const origin = computeOrigin ?  computeOrigin(event) : undefined;

            const menuPoint = computeMenuPoint(event);

            const newActive = {
                mouseX: menuPoint.x,
                mouseY: menuPoint.y,
                origin
            };

            store.setActive(newActive);


        }, [computeOrigin, opts.onContextMenu, store]);

        const onLongPress = React.useCallback((event: React.MouseEvent | React.TouchEvent) => {

            function isTouchEvent(event: React.MouseEvent | React.TouchEvent): event is React.TouchEvent {
                return "touches" in event;
            }

            function toMouseEvent(): IMouseEvent {

                if (isTouchEvent(event)) {
                    return {
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                        pageX: event.touches[0].pageX,
                        pageY: event.touches[0].pageY,
                        target: event.target,
                        nativeEvent: event.nativeEvent,
                        preventDefault: event.preventDefault,
                        stopPropagation: event.stopPropagation,
                        getModifierState: event.getModifierState
                    };
                }

                return event;

            }

            onContextMenu(toMouseEvent());

        }, [onContextMenu]);

        // const longPressHandlers = useLongPress(onLongPress, NULL_FUNCTION);
        // return {onContextMenu, ...longPressHandlers};

        return {onContextMenu};

    }

    const ContextMenuInner = observer(function(props: ContextMenuInnerProps<O>) {

        const {MenuComponent} = props;

        const store = useMUIContextMenuStore();

        const handleClose = React.useCallback(() => {
            store.setActive(undefined);
        }, [store])

        const active = store.active;

        return (
            <>
                {active &&
                    <MUIContextMenu {...active}
                                    anchorEl={props.anchorEl}
                                    handleClose={handleClose}>
                        <MenuComponent origin={active.origin}/>
                    </MUIContextMenu>}

            </>
        );
    });

    const ProviderComponentInner = (props: IContextMenuProps) => {
        return (
            <>
                <ContextMenuInner MenuComponent={MenuComponent} anchorEl={props.anchorEl}/>

                {props.children}
            </>
        );

    }

    const ProviderComponent = (props: IContextMenuProps): JSX.Element => {

        return (
            <ContextMenuContext.Provider value={{computeOrigin: opts.computeOrigin}}>
                <MUIContextMenuStoreProvider>
                    <ProviderComponentInner {...props}/>
                </MUIContextMenuStoreProvider>
            </ContextMenuContext.Provider>
        );
    };

    return [ProviderComponent, useContextMenu];

}

interface ContextMenuInnerProps<O> {
    readonly MenuComponent: (props: MenuComponentProps<O>) => JSX.Element | null
    readonly anchorEl?: HTMLElement;
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

    const handleContextMenu = React.useCallback((event: React.MouseEvent) => {
        // needed so that you can't bring up a native context menu on a context
        // menu
        event.preventDefault();
    }, []);

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

