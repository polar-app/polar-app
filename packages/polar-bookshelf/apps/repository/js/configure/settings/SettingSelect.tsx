import {useLogger} from "../../../../../web/js/mui/MUILogger";
import * as React from "react";
import {PreviewWarning} from "./PreviewWarning";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {Box, createStyles, FormControlLabel, makeStyles, Paper, Radio, RadioGroup} from "@material-ui/core";
import {Devices} from "polar-shared/src/util/Devices";
import {ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

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

export const SettingSelect = (props: IProps) => {

    const classes = useStyles();
    const log = useLogger();
    const prefs = usePrefsContext();

    const {name} = props;

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Setting " + name);

        prefs.set(props.name, evt.target.value);

        const doCommit = async () => {
            await prefs.commit();
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    };

    const value = prefs.get(props.name)
                       .getOrElse(props.options[0].id);

    return (
        <Box>
            <ListItem alignItems="flex-start">
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText
                    primary={props.title}
                    secondary={props.description}
                    />
                </ListItem>

                <Box ml={Devices.isPhone()? 9 : 2} mr={Devices.isPhone()? 2 : 2}>
                        <RadioGroup name={name} value={value} onChange={onChange}>
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
                    </Box>

                {props.preview && <PreviewWarning/>}
        </Box>

                    
    );

};
