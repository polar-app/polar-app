import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import * as React from "react";
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";
import {MUIIconText} from "../../../../../web/js/mui/MUIIconText";
import {Box} from "@material-ui/core";
import { Devices } from "polar-shared/src/util/Devices";

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
    readonly className?: string | undefined;

    /**
     * Optional callback to listen to settings.
     */
    readonly onChange?: (value: boolean) => void;
}

export const SettingToggle =  React.memo(function SettingToggle(props: IProps){

    const log = useLogger();

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
        <Box mx={3}>
            <div style={{display: 'flex', alignItems: 'center'}}>

                <MUIIconText style={{ flex: 1 }} icon={props.icon}>
                    <Box component={'h3'}pt={1} style={{ position: 'relative', display: 'inline-block' }}>
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
                    </Box>
                </MUIIconText>

                <Box component={'div'} my={'auto'} >
                    <SwitchButton size="medium"
                                  initialValue={value}
                                  onChange={value => onChange(value)} />
                </Box>

            </div>

            <div>
                <Box component="p" color="text.secondary" ml={Devices.isPhone() && 5.5} >
                    {props.description}
                </Box>
            </div> 
        </Box>
    );

});