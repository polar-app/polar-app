import * as React from 'react';
import {
    isAcademicOccupationProfile,
    OccupationProfile
} from "../../../../apps/repository/js/configure/profile/ProfileConfigurator";
import {useAnalytics} from "../../analytics/Analytics";
import {MUIDialog} from "../../ui/dialogs/MUIDialog";
import {useHistory} from 'react-router-dom';
import {useComponentDidMount} from "../../hooks/ReactLifecycleHooks";
import {WelcomeScreenContent} from "./WelcomeScreenContent";
import Box from "@material-ui/core/Box";
import {PlansTable} from "../../../../apps/repository/js/plans_table/PlansTable";
import {PlanPricingInterval} from "../../../../apps/repository/js/plans_table/PlansData";
import {Button, Typography} from "@material-ui/core";
import {DefaultChangePlanContextProvider} from "../../../../apps/repository/js/premium/actions/DefaultChangePlanContextProvider";

export const WelcomeScreen = React.memo(function WelcomeScreen() {

    const analytics = useAnalytics();
    const history = useHistory();
    const [isOnboardingComplete, setIsOnboardingComplete] = React.useState(false);

    const handleProfile = React.useCallback((profile: OccupationProfile) => {

        analytics.traits({
            user_occupation: profile.occupation.id
        })

        if (isAcademicOccupationProfile(profile)) {
            analytics.traits({
                user_field_of_study: profile.fieldOfStudy.id,
                // user_university_id: profile.university.id,
                // user_university_name_slug: Slugs.calculate(profile.university.name),
                // user_university_domain: profile.university.domain
            });
        }

        analytics.event2('welcome-profile-completed', {
            ...profile
        });

        setIsOnboardingComplete(true);

    }, [analytics]);

    const handleClose = React.useCallback(() => {
        analytics.event2('welcome-profile-skipped');
        history.replace('/');
    }, [analytics, history]);

    useComponentDidMount(() => {
        analytics.event2('welcome-screen-triggered');
    });

    return (
        <MUIDialog open={true} onClose={handleClose} maxWidth="lg">

            {! isOnboardingComplete
                ? (
                    <Box minHeight="600px" display="flex">
                        <WelcomeScreenContent onProfile={handleProfile}/>
                    </Box>
                ) : <WelcomeUpgradeDialog />
            }

        </MUIDialog>
    );

});

const WelcomeUpgradeDialog = () => {
    const history = useHistory();
    const handleClose = React.useCallback(() => history.replace('/'), [history]);

    return (
        <MUIDialog open maxWidth="lg" fullWidth onClose={handleClose}>
            <DefaultChangePlanContextProvider>
                <Box display="flex"
                     flexDirection="column"
                     alignItems="center"
                     px="2rem"
                     py="2rem">

                    <h1>🎉 Welcome to your first two weeks free premium plan</h1>
                    <Box mt="3rem" width="100%" px="2rem">
                        <PlansTable pricingInterval={PlanPricingInterval.Monthly}
                                    highlight="plus"
                                    currentPlanLabel="First Two Weeks Free" />
                    </Box>
                    <Box display="flex"
                         justifyContent="space-between"
                         alignItems="center"
                         mt="4rem"
                         width="100%">

                        <Box width="100px" />
                        <Typography variant="body2" color="textSecondary">
                            Nothing will be charged at this time
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={handleClose}>Get Started</Button>
                    </Box>
                </Box>
            </DefaultChangePlanContextProvider>
        </MUIDialog>
    );
};


