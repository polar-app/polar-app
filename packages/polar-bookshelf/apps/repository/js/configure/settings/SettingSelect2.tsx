import * as React from "react";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import {Devices} from "polar-shared/src/util/Devices";

interface IProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly options: ReadonlyArray<IOption>;
    readonly preview?: boolean;
    readonly icon: JSX.Element;
}

interface IOption {
    readonly id: string;
    readonly label: string;
}

export const SwitchSelect = (props: IProps) => {

    const {name} = props;

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Setting Changed");
    };

    return (
        <Box pt={2}>
            <ListItem>
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>
            <ListItemText
            primary={props.title}
            secondary={props.description}
            />

            <Box pt={2} ml={Devices.isPhone()? 9 : 2} mr={Devices.isPhone()? 2 : 2}>
                <RadioGroup name={name} onChange={onChange}>
                    {props.options.map(current =>
                        <FormControlLabel
                            key={current.id}
                            value={current.id}
                            labelPlacement="start"
                            control={<Radio />}
                            label={current.label}
                        />
                    )}
                </RadioGroup>

            </Box>
                
            </ListItem>
        </Box>
        
    );
};