import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SendIcon from "@material-ui/icons/Send";
import ListItemText from "@material-ui/core/ListItemText";
import {MUITooltip} from "../../../../web/js/mui/MUITooltip";

export class AddContentMenuItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        if (this.props.hidden) {
            return null;
        }


        return (

            <MUITooltip title={this.props.tooltip}>

                <MenuItem id={this.props.id}
                          onClick={() => this.props.onClick()}>

                    {this.props.children}

                    <ListItemIcon>
                        {this.props.icon}
                    </ListItemIcon>
                    <ListItemText primary={this.props.text} />

                </MenuItem>

            </MUITooltip>

        );

    }

}

interface IProps {
    readonly id: string;
    readonly tooltip: string;
    readonly hidden: boolean;
    readonly onClick: () => void;
    readonly icon: JSX.Element;
    readonly text: string;
}

interface IState {
}
