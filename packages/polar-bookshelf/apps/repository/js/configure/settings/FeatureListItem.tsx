import * as React from "react";
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import {Box, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";

export interface PrefsWriter {

    readonly isMarked: (key: string, defaultValue?: boolean) => boolean;

    readonly mark: (key: string, value: boolean) => void;

    readonly commit: () => Promise<void>;

}

interface IProps {
    readonly title: string;
    readonly description: string;
    readonly pref: string;
}

export const FeatureListItem =  React.memo(function FeatureListItem(props: IProps){

    const log = useLogger();
    const prefs = usePrefsContext();

    const {pref} = props;

    const value = prefs.isMarked(pref);

    const onChange = React.useCallback((value: boolean) => {

        prefs.mark(pref, value);

        const doCommit = async () => {
            await prefs.commit();
            console.log("Prefs written");
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));

    }, [log, pref, prefs]);

    return (
        <>
            <ListItem alignItems="flex-start">
                {/*<ListItemIcon>*/}
                {/*    /!*{props.icon}*!/*/}
                {/*</ListItemIcon>*/}

                <ListItemText primary={props.title} secondary={(
                    <>
                        {props.description}

                        {/*<Box display="flex" justifyContent="flex-start">*/}
                        {/*    <Button>Copy URL</Button>*/}
                        {/*</Box>*/}
                    </>
                )}/>

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
