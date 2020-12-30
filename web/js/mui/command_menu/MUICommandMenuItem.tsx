import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import * as React from "react";
import {KeySequences} from "../../hotkeys/KeySequences";
import { MUIListItemRight } from "./MUIListItemRight";

interface IProps {

    readonly icon?: React.ReactNode;

    readonly text: string;

    /**
     * True if this items should be shown as selected.
     */
    readonly selected?: boolean;

    readonly sequences?: ReadonlyArray<string>;

    readonly onSelected: () => void;

}

export const MUICommandMenuItem = React.memo((props: IProps) => {

    return (
        <ListItem disableGutters
                  button
                  selected={props.selected}
                  onClick={props.onSelected}
                  style={{padding: '5px'}}>

            {props.icon && (
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>)}

            {props.text}

            <MUIListItemRight>
                <>
                    {props.sequences && (
                        <KeySequences sequences={props.sequences}/>)}
                </>
            </MUIListItemRight>

        </ListItem>
    );

});