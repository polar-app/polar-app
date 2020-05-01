import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {NodeSelectToggleType} from "./MUITreeView";
import isEqual from "react-fast-compare";

interface IProps {
    readonly onNodeSelectToggle: (node: string, type: NodeSelectToggleType) => void;
    readonly nodeId: string;
    readonly selected: boolean;
    readonly label: string;
    readonly info?: string | number;
}

export const MUITreeItemLabel = React.memo((props: IProps) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}>

            <Checkbox checked={props.selected}
                      onChange={() => props.onNodeSelectToggle(props.nodeId, 'checkbox')}
                      style={{padding: 0}}

            />

            <div style={{flexGrow: 1}}
                 onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>
                {props.label}
            </div>

            <div onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>

                <Typography variant="caption" color="textSecondary">
                    {props.info}
                </Typography>
            </div>

        </div>
    );

}, isEqual);
