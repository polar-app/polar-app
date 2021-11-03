import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import * as React from "react";
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";

import {Box} from "@material-ui/core";
import {ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

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
        <Box mx={2} alignItems={'center'} display={'flex'}>

                <ListItem alignItems="flex-start">
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText
                    primary={props.title}
                    secondary={props.description}
                    />
                    <SwitchButton size="medium"
                                  initialValue={value}
                                  onChange={value => onChange(value)} />
                </ListItem>
        </Box>
    );

});
