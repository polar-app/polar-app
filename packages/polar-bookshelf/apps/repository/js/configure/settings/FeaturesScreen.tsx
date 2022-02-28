import * as React from 'react';
import Box from '@material-ui/core/Box';
import {createStyles, List, makeStyles} from "@material-ui/core";
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import {useFeaturesRegistry} from "../../../../../web/js/features/FeaturesRegistry";
import {FeatureListItem} from "./FeatureListItem";
import {useFirestorePrefs} from "../../persistence_layer/FirestorePrefs";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {useErrorHandler} from "../../../../../web/js/mui/useErrorHandler";

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

    const errorHandler = useErrorHandler();

    const featuresRegistry = useFeaturesRegistry()

    const prefs = useFirestorePrefs();

    const onClick = React.useCallback(() => {

        const keys = Object.keys(featuresRegistry);

        keys.forEach(key => prefs.remove(key));

        prefs.commit()
            .catch(err => errorHandler("Could not write prefs: ", err));

    }, [errorHandler, featuresRegistry, prefs]);

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
