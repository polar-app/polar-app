import * as React from "react";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import {Box, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {useFirestorePrefs} from "../../persistence_layer/FirestorePrefs";
import {useErrorHandler} from "../../../../../web/js/mui/useErrorHandler";

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

export const SettingListItem =  React.memo(function SettingListItem(props: IProps){

    const errorHandler = useErrorHandler();
    const prefs = useFirestorePrefs();

    const {name, defaultValue} = props;

    const value = prefs.isMarked(name, defaultValue);

    const onChange = React.useCallback((value: boolean) => {
        console.log("Setting " + name);
        prefs.mark(name, value);

        const doCommit = async () => {
            await prefs.commit();
            console.log("Prefs written");
        };

        doCommit()
            .catch(errorHandler);

    }, [errorHandler, name, prefs]);

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
                                      checked={value}
                                      onChange={value => onChange(value)} />
                    </Box>
                </ListItemIcon>
            </ListItem>
        </>
    );

});
