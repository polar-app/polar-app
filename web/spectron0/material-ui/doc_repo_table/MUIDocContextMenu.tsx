import React from "react";
import Menu from "@material-ui/core/Menu";
import {MUIDocDropdownMenuItems} from "./MUIDocDropdownMenuItems";

export type ContextMenuHandler = (event: React.MouseEvent<HTMLElement>) => void;

// FIXME: maybe I want to use react context for this... then I get the
// context menu handler, and then set it with a HOC

interface IProps {
    readonly onClose: () => void;
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

    // FIXME how do I create a component to JUST add a new event handler?

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

                    <MUIDocDropdownMenuItems onClose={props.onClose}/>

                </Menu>
            }
            {props.render(handleContextMenu)}
        </>
    );

};
