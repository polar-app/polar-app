import React from "react";
import Menu from "@material-ui/core/Menu";
import {MUIDocDropdownMenuItems} from "./MUIDocDropdownMenuItems";

interface IProps {
    readonly onClose: () => void;
    readonly children: React.ReactElement;
}

interface IState {
    readonly mouseX?: number;
    readonly mouseY?: number;
}

export const MUIDocDropdownContextMenu = (props: IProps) => {

    const [state, setState] = React.useState<IState>({});

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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
        <div onContextMenu={handleClick}>
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
            {props.children}
        </div>
    );

};
