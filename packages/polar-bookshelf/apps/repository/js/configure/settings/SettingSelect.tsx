import {useLogger} from "../../../../../web/js/mui/MUILogger";
import * as React from "react";
import {PreviewWarning} from "./PreviewWarning";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {createStyles, FormControlLabel, useTheme,Box, makeStyles, Radio, RadioGroup, Paper} from "@material-ui/core";
import {MUIIconText} from "../../../../../web/js/mui/MUIIconText";
import { Devices } from "polar-shared/src/util/Devices";

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
        <div>
            <div>

                <Box mx={3}>
                    <Box pt={2}>
                        <MUIIconText style={{ flex: 1}} icon={props.icon}>
                                <h3><b>{props.title}</b></h3>
                        </MUIIconText>
                    </Box>
                    <Box component="p" color="text.secondary" ml={Devices.isPhone() && 5.5} >
                        {props.description}
                    </Box>
                </Box>

                <Paper >
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
                </Paper>

            </div>

            {props.preview && <PreviewWarning/>}

        </div>
    );

};
