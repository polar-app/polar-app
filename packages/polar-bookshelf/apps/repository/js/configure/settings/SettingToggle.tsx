import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import * as React from "react";
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";
import {MUIIconText} from "../../../../../web/js/mui/MUIIconText";
import { mergeClasses } from "@material-ui/core/node_modules/@material-ui/styles";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        margins:{
            margin: '30px 16px'
        }
    }),
);

export interface PrefsWriter {

    readonly isMarked: (key: string, defaultValue?: boolean) => boolean;

    readonly mark: (key: string, value: boolean) => void;

    readonly commit: () => Promise<void>;

}

interface IProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly prefs: PrefsWriter | undefined;
    readonly preview?: boolean;
    readonly defaultValue?: boolean;
    readonly icon?: JSX.Element;
    readonly beta?: boolean;
    readonly className?: string;

    /**
     * Optional callback to listen to settings.
     */
    readonly onChange?: (value: boolean) => void;
}

export const SettingToggle = (props: IProps) => {

    const log = useLogger();
    const classes = useStyles();

    const {prefs, name, defaultValue} = props;

    if (! prefs) {
        return null;
    }

    const value = prefs.isMarked(name, defaultValue);

    const onChange = (value: boolean) => {
        console.log("Setting " + name);
        LocalStorageFeatureToggles.set(name, value);
        prefs.mark(name, value);

        if (props.onChange) {
            props.onChange(value);
        }

        const doCommit = async () => {
            await prefs.commit();
            console.log("Prefs written");
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    };

    return (
        <div className={classes.margins}>
            <div style={{display: 'flex', alignItems: 'center'}}>

                <MUIIconText style={{ flex: 1 }} icon={props.icon}>
                    <h3 style={{ position: 'relative', display: 'inline-block' }}>
                        <b>{props.title}</b>
                        {props.beta && (
                            <div style={{
                                position: 'absolute',
                                left: '100%',
                                top: -10,
                                color: 'red',
                                fontSize: 9,
                            }}>BETA</div>
                        )} 
                    </h3>
                </MUIIconText>

                <div className="mt-auto mb-auto">
                    <SwitchButton size="medium"
                                  initialValue={value}
                                  onChange={value => onChange(value)} />
                </div>

            </div>

            <div>
                <p>{props.description}</p>
            </div>
        </div>
    );

};
