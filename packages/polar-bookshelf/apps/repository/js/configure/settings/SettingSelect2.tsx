import * as React from "react";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {ListItem, ListItemIcon, ListItemText, makeStyles, createStyles} from "@material-ui/core";
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

const useStyles = makeStyles((theme) =>
    createStyles({
        radioLabelRoot: {
            marginLeft: Devices.isDesktop()? theme.spacing(2): 0,
            marginRight: Devices.isDesktop()? theme.spacing(2): 0,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        radioLabel: {
            fontSize: '1rem',
        },

    }),
);

export const SwitchSelect = (props: IProps) => {

    const classes = useStyles();
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
                </ListItem>

                <ListItem>
                    <RadioGroup name={name} onChange={onChange}>
                        {props.options.map(current =>
                            <FormControlLabel
                                key={current.id}
                                value={current.id}
                                labelPlacement="start"
                                classes={{
                                    root: classes.radioLabelRoot,
                                    label: classes.radioLabel,
                                }}
                                control={<Radio />}
                                label={current.label}
                            />
                        )}
                    </RadioGroup>
                </ListItem>
               
                
            </Box>

        
    );
};