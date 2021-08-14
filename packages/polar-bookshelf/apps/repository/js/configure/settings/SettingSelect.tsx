import {useLogger} from "../../../../../web/js/mui/MUILogger";
import * as React from "react";
import {PreviewWarning} from "./PreviewWarning";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {createStyles, FormControlLabel, makeStyles, Radio, RadioGroup} from "@material-ui/core";
import {MUIIconText} from "../../../../../web/js/mui/MUIIconText";

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

const useStyles = makeStyles(() =>
    createStyles({
        radioLabelRoot: {
            margin: 0,
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
        <div style={{ margin: '30px 16px' }}>
            <div>

                <div className="mt-auto mb-auto">
                    <MUIIconText icon={props.icon}>
                        <h3><b>{props.title}</b></h3>
                    </MUIIconText>
                    <p>
                        {props.description}
                    </p>
                </div>

                <div className="mt-auto mb-auto">

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

                </div>

            </div>

            {props.preview && <PreviewWarning/>}

        </div>
    );

};
