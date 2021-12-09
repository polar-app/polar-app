import * as React from 'react';
import Box from '@material-ui/core/Box';
import {createStyles, List, makeStyles} from "@material-ui/core";
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import {useFeaturesRegistry} from "../../../../../web/js/features/FeaturesRegistry";
import {FeatureListItem} from "./FeatureListItem";

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

        </Box>
    );
}

export const FeaturesScreen = React.memo(function FeaturesScreen() {

    return (
        <AdaptivePageLayout title="Feature Toggles">
            <Main/>
        </AdaptivePageLayout>
    );
});
