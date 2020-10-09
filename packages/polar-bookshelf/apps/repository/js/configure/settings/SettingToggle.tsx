import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import * as React from "react";
import {PersistentPrefs} from "../../../../../web/js/util/prefs/Prefs";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";
import {PreviewWarning} from "./PreviewWarning";

interface IProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly prefs: PersistentPrefs | undefined;
    readonly preview?: boolean;
    readonly defaultValue?: boolean;

    /**
     * Optional callback to listen to settings.
     */
    readonly onChange?: (value: boolean) => void;
}

export const SettingToggle = (props: IProps) => {

    const log = useLogger();

    const {prefs, name, defaultValue} = props;

    if (! prefs) {
        return null;
    }

    const value = prefs.isMarked(name, defaultValue);

    const onChange = (value: boolean) => {
        console.log("Setting " + name);
        FeatureToggles.set(name, value);
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
        <div>
            <div style={{display: 'flex'}}>

                <div className="mt-auto mb-auto"
                     style={{flexGrow: 1}}>
                    <h2><b>{props.title}</b></h2>
                </div>

                <div className="mt-auto mb-auto">
                    <SwitchButton size="medium"
                                  initialValue={value}
                                  onChange={value => onChange(value)} />
                </div>

            </div>

            <div>
                <p>
                    {props.description}
                </p>
            </div>

            {props.preview && <PreviewWarning/>}

        </div>
    );

};
