import * as React from 'react';
import Box from '@material-ui/core/Box';
import {createStyles, List, makeStyles} from "@material-ui/core";
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import {useFeaturesRegistry} from "../../../../../web/js/features/FeaturesRegistry";
import {FeatureListItem} from "./FeatureListItem";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& h1, & h2, & h3, & h4, & h5': {
                margin: 0,
            },
            height: '100%',
            overflow: 'auto'
        },
    }),
);

const Main = () => {

    const classes = useStyles();

    const featuresRegistry = useFeaturesRegistry()

    return (
        <Box pt={1} className={classes.root}>

            <List>

                {Object.entries(featuresRegistry).map(entry => {
                    const key = entry[0];
                    const value = entry[1];

                    return (
                        <FeatureListItem key={key}
                                         title={value.title}
                                         description={value.description}
                                         pref={key}
                                         />
                    );

                })}

            </List>

            <Divider/>

            <Box pt={1} pb={1} display="flex" justifyContent="flex-end">
                <ResetButton/>
            </Box>

        </Box>
    );
}

const ResetButton = () => {

    const log = useLogger();

    const featuresRegistry = useFeaturesRegistry()

    const prefs = usePrefsContext();

    const onClick = React.useCallback(() => {

        const keys = Object.keys(featuresRegistry);

        keys.forEach(key => prefs.remove(key));

        const doCommit = async () => {
            await prefs.commit();
            console.log("Prefs written");
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));

    }, [log, featuresRegistry, prefs]);

    return (
        <Button onClick={onClick}>Reset to default</Button>
    );
}

export const FeaturesScreen = React.memo(function FeaturesScreen() {

    return (
        <AdaptivePageLayout title="Feature Toggles">
            <Main/>
        </AdaptivePageLayout>
    );
});
