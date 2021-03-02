import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import * as React from "react";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";
import {PreviewWarning} from "./PreviewWarning";

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
                <p style={{fontSize: '1.3rem'}}>
                    {props.description}
                </p>
            </div>

            {/*{props.preview && <PreviewWarning/>}*/}

        </div>
    );

};
