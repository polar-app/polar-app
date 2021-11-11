import * as React from "react";
import {useContext} from 'react';
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";
import { ListItem, ListItemText, ListItemIcon, Box, ListItemSecondaryAction } from "@material-ui/core";
import { MUIThemeTypeContext } from "../../../../../web/js/mui/context/MUIThemeTypeContext";
import { usePrefsContext } from "../../persistence_layer/PrefsContext2";

export interface PrefsWriter {

    readonly isMarked: (key: string, defaultValue?: boolean) => boolean;

    readonly mark: (key: string, value: boolean) => void;

    readonly commit: () => Promise<void>;

}

interface IProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly preview?: boolean;
    readonly defaultValue?: boolean;
    readonly icon?: JSX.Element;
    readonly beta?: boolean;
    readonly className?: string | undefined;
}

export const SettingToggle =  React.memo(function SettingToggle(props: IProps){

    const log = useLogger();
    const {theme, setTheme} = useContext(MUIThemeTypeContext);
    const prefs = usePrefsContext();

    const {name, defaultValue} = props;

    if (! prefs) {
        return null;
    }

    const value = prefs.isMarked(name, defaultValue);
    
    const handleDarkModeToggle = React.useCallback((enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';

        setTimeout(() => setTheme(theme), 1);

    },[theme]);
    
    const onChange = (value: boolean) => {
        console.log("Setting " + name);
        LocalStorageFeatureToggles.set(name, value);
        prefs.mark(name, value);

        if (props.name === 'dark-mode') {
            handleDarkModeToggle(value);
        }

        const doCommit = async () => {
            await prefs.commit();
            console.log("Prefs written");
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    };

    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.title} secondary={props.description}/>
                <ListItemIcon>
                    <Box pl={1}>
                        <SwitchButton size="small"
                        initialValue={value}
                        onChange={value => onChange(value)} />
                    </Box>
                </ListItemIcon>
            </ListItem>
        </>
    );

});
