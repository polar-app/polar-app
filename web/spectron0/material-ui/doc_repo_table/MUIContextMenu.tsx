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

interface IMenuComponentProps {

}

interface IChildComponentProps {
    readonly children: JSX.Element;
}

export function createContextMenu(MenuComponent: (props: IMenuComponentProps) => JSX.Element): (props: IChildComponentProps) => JSX.Element {

    return (props: IChildComponentProps): JSX.Element => {

        interface IMousePosition {
            readonly mouseX: number;
            readonly mouseY: number;
        }

        const [mousePosition, setMousePosition] = useState<IMousePosition | undefined>(undefined);

        const onContextMenu = React.useCallback((event: React.MouseEvent<HTMLElement>): void => {
            event.stopPropagation();
            event.preventDefault();

            const newMousePosition = {
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
            };

            setMousePosition(newMousePosition);

        }, []);

        const handleClose = React.useCallback(() => {
            setMousePosition(undefined);
        }, [])

        return (
            <ContextMenuContext.Provider value={{onContextMenu}}>
                {mousePosition &&
                    <MUIContextMenu {...mousePosition}
                                    handleClose={handleClose}>
                        <MenuComponent/>
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
