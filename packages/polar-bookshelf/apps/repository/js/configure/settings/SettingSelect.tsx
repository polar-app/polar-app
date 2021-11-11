import * as React from "react";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {PreviewWarning} from "./PreviewWarning";
import {Box, createStyles, ListItemText, ListItemIcon, FormControlLabel, ListItem, makeStyles, Radio, RadioGroup} from "@material-ui/core";

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
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        radioLabel: {
            color: theme.palette.text.secondary
        },

    }),
);

export const SettingSelect = (props: IProps) => {

    const classes = useStyles();
    const log = useLogger();
    const prefs = usePrefsContext();

    const {name} = props;

    if (! prefs) {
        return null;
    }

    const onChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Setting " + name);

        prefs.set(props.name, evt.target.value);

        const doCommit = async () => {
            await prefs.commit();
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    },[prefs]);

    const value = prefs.get(props.name)
                       .getOrElse(props.options[0].id);

    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.title} secondary={props.description}/>
                <ListItemText>
                    {props.preview && <PreviewWarning/>}
                </ListItemText>
            </ListItem>
            {props.options && <ListItem alignItems='center'>
                <Box pl={5} width={'100%'}>
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
            </ListItem>
            }
        </>
    );

};
