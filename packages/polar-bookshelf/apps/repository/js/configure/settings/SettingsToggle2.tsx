import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import * as React from "react";
import {ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, ListSubheader } from "@material-ui/core";

export interface PrefsWriter {

    readonly isMarked: (key: string, defaultValue?: boolean) => boolean;

    readonly mark: (key: string, value: boolean) => void;

    readonly commit: () => Promise<void>;

}

interface IProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly icon?: JSX.Element;
    readonly value?: string;
    readonly label?: string;

    readonly onChange?: (value: boolean) => void;
}

export const SwitchToggle =  React.memo(function SettingToggle(props: IProps){

    const onChange = (value: boolean) => {
        console.log("Setting Changed");
    };

    return (

        <ListItem>
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>
            <ListItemText
            primary={props.title}
            secondary={props.description}
            />

            <ListItemSecondaryAction>
                <SwitchButton size="medium"
                    onChange={value => onChange(value)} />
            </ListItemSecondaryAction>
        </ListItem>
    );
});
