import React from "react";
import Menu from "@material-ui/core/Menu";
import {
    DocContextMenuProps,
    MUIDocDropdownMenuItems
} from "./MUIDocDropdownMenuItems";

export type ContextMenuHandler = (event: React.MouseEvent<HTMLElement>) => void;

interface IProps extends DocContextMenuProps {
    readonly render: (contextMenuHandler: ContextMenuHandler) => void;
}

interface IState {
    readonly mouseX?: number;
    readonly mouseY?: number;
}

export const MUIDocContextMenu = (props: IProps) => {

    const [state, setState] = React.useState<IState>({});

    const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleClose = () => {
        setState({})
    };

    return (
        <>
            {state.mouseX !== undefined && state.mouseY !== undefined &&
                <Menu
                    keepMounted
                    open={state.mouseX !== undefined}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={{
                        top: state.mouseY,
                        left: state.mouseX
                    }}>

                    <MUIDocDropdownMenuItems {...props}/>

                </Menu>
            }

            {props.render(handleContextMenu)}

        </>
    );

};
