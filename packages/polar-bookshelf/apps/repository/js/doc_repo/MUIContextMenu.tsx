import React, {useState} from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Menu from "@material-ui/core/Menu";
import isEqual from "react-fast-compare";

type OnContextMenuCallback = (event: React.MouseEvent<HTMLElement>) => void;

interface IContextMenuCallbacks {
    readonly onContextMenu: OnContextMenuCallback;
}

export const ContextMenuContext
    = React.createContext<IContextMenuCallbacks>({onContextMenu: NULL_FUNCTION});

interface IChildComponentProps {
    readonly children: JSX.Element;
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
     * Create a new origin object that's custom that we can use
     */
    readonly computeOrigin?: (event: React.MouseEvent<HTMLElement>) => O | undefined;

}

export function createContextMenu<O>(MenuComponent: (props: MenuComponentProps<O>) => JSX.Element,
                                     opts: CreateContextMenuOpts<O> = {}): (props: IChildComponentProps) => JSX.Element {

    return (props: IChildComponentProps): JSX.Element => {

        interface IContextMenuActive {
            readonly mouseX: number;
            readonly mouseY: number;

            readonly origin: O | undefined;
        }

        const [active, setActive] = useState<IContextMenuActive | undefined>(undefined);

        const onContextMenu = React.useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
            event.stopPropagation();
            event.preventDefault();

            const origin = opts.computeOrigin ?  opts.computeOrigin(event) : undefined;

            const newActive = {
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
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
                                    handleClose={handleClose}>
                        <MenuComponent origin={active.origin}/>
                    </MUIContextMenu>}

                {props.children}

            </ContextMenuContext.Provider>
        );
    };

}

export function useContextMenu(opts: Partial<IContextMenuCallbacks> = {}): IContextMenuCallbacks {

    const contextMenuCallbacks = React.useContext(ContextMenuContext);

    const onContextMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        const parent = opts.onContextMenu || NULL_FUNCTION;
        parent(event);

        contextMenuCallbacks.onContextMenu(event);

    }, []);

    return {onContextMenu};

}

interface MUIContextMenuProps {

    readonly mouseX: number;
    readonly mouseY: number;

    /**
     * Callback that should be called when we want to close the menu.
     */
    readonly handleClose: () => void;

    readonly children: React.ReactFragment | JSX.Element;

}

export const MUIContextMenu = React.memo((props: MUIContextMenuProps) => {

    const handleClose = React.useCallback(() => {
        props.handleClose();
    }, [])

    return (
        <Menu
            keepMounted
            open={true}
            onClose={handleClose}
            onClick={handleClose}
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
}, isEqual);
