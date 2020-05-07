import React, {useState} from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Menu from "@material-ui/core/Menu";

type OnContextMenuCallback = (event: React.MouseEvent<HTMLElement>) => void;

interface IContextMenuContext {
    readonly onContextMenu: OnContextMenuCallback;
}

export const ContextMenuContext
    = React.createContext<IContextMenuContext>({onContextMenu: NULL_FUNCTION});

interface IMenuComponentProps {

    readonly mouseX: number;
    readonly mouseY: number;

    /**
     * Callback that should be called when we want to close the menu.
     */
    readonly handleClose: () => void;

}

interface IChildComponentProps {
    // readonly children: (props: IContextMenuProps) => JSX.Element;
    readonly children: JSX.Element;
}

export function createContextMenu(MenuComponent: (props: IMenuComponentProps) => JSX.Element): (props: IChildComponentProps) => JSX.Element {

    return (props: IChildComponentProps) => {

        interface IMousePosition {
            readonly mouseX: number;
            readonly mouseY: number;
        }

        const [mousePosition, setMousePosition] = useState<IMousePosition | undefined>(undefined);

        const onContextMenu = (event: React.MouseEvent<HTMLElement>): void => {
            event.stopPropagation();
            event.preventDefault();

            setMousePosition({
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
            });

        };

        const handleClose = React.useCallback(() => {
            setMousePosition(undefined);
        }, [])

        return (
            <ContextMenuContext.Provider value={{onContextMenu}}>
                {mousePosition &&
                    <MenuComponent {...mousePosition} handleClose={handleClose}/>}

                {props.children}

            </ContextMenuContext.Provider>
        );
    }

}

export function useContextMenu(): OnContextMenuCallback {
    const contextMenuContext = React.useContext(ContextMenuContext);
    return contextMenuContext.onContextMenu;
}

export const MUIContextMenu = (props: IMenuComponentProps & IChildComponentProps) => (
    <Menu
        keepMounted
        open={true}
        onClose={props.handleClose}
        onClick={props.handleClose}
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
