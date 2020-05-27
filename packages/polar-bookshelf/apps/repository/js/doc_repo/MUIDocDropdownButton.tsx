import React from "react";
import {MUIDocDropdownMenu} from "./MUIDocDropdownMenu";
import IconButton from "@material-ui/core/IconButton";
import grey from "@material-ui/core/colors/grey";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Callback1} from "polar-shared/src/util/Functions";

interface IProps {
    readonly onClick: Callback1<React.MouseEvent>;
}

interface IState {
    readonly anchorEl: HTMLElement | null;
}

// FIXME: migrate this to a cached functional component...
export class MUIDocDropdownButton extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);

        this.state = {
            anchorEl: null
        }

    }

    public render() {

        const handleClick = (event: React.MouseEvent<HTMLElement>) => {

            this.props.onClick(event);

            this.setState({
                anchorEl: event.currentTarget
            });
        };

        const handleClose = () => {
            this.setState({
                anchorEl: null
            });
        };

        const {anchorEl} = this.state;

        // FIXME: move to MUIMenu

        return (
            <div>

                <IconButton
                    aria-controls="doc-dropdown-menu"
                    aria-haspopup="true"
                    // variant="contained"
                    color="default"
                    onClick={handleClick}
                    size="small"
                    style={{color: grey[500]}}>
                    <MoreVertIcon/>
                </IconButton>
                {anchorEl &&
                <MUIDocDropdownMenu anchorEl={anchorEl}
                                    onClose={handleClose}/>
                }
            </div>
        );

    }

}
