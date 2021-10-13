import {useLogger} from "../../../../../web/js/mui/MUILogger";
import * as React from "react";
import {PreviewWarning} from "./PreviewWarning";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {createStyles, FormControlLabel, useTheme, makeStyles, Radio, RadioGroup} from "@material-ui/core";
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
        margins:{
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(3)
        },
        radioLabel: {
            fontSize: '1rem',
        },
        radioBackground:{
            width: '100%',
            background: '#444444',
            paddingLeft: theme.spacing(7.5)
        },
        paragraphMobile:{
            marginLeft: theme.spacing(5.5),
            color:  theme.palette.text.secondary
        },
        fullWidth:{
            width: '100%'
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

                <div className={classes.margins}>
                <MUIIconText style={{ flex: 1}} className={'pt-2'}  icon={props.icon}>
                        <h3><b>{props.title}</b></h3>
                    </MUIIconText>
                    <p className={Devices.isPhone()? classes.paragraphMobile: undefined}>
                        {props.description}
                    </p>
                </div>

                <div>
                    <RadioGroup className={Devices.isPhone()? classes.radioBackground : undefined} name={name} value={value} onChange={onChange}>
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

                </div>

            </div>

            {props.preview && <PreviewWarning/>}

        </div>
    );

};
