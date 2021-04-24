import * as React from "react";
import {KeySequences} from "./KeySequences";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { ListItemRight } from "./ListItemRight";

interface IProps {
    readonly icon?: React.ReactNode;
    readonly text: string;
    readonly selected?: boolean;
    readonly sequences: ReadonlyArray<string>;
    readonly onClick: (event: React.MouseEvent) => void;
}

export const ActionListItem = React.memo(function ActionListItem(props: IProps) {

    return (
        <ListItem disableGutters
                  button
                  selected={props.selected}
                  onClick={props.onClick}
                  style={{padding: '5px'}}>

            {props.icon && (
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>)}

            {props.text}

            <ListItemRight>
                <KeySequences sequences={props.sequences}/>
            </ListItemRight>

        </ListItem>
    );

});

