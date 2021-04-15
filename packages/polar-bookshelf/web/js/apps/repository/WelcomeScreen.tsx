import * as React from 'react';
import {
    isAcademicOccupationProfile,
    OccupationProfile,
    ProfileConfigurator
} from "../../../../apps/repository/js/configure/profile/ProfileConfigurator";
import {useAnalytics} from "../../analytics/Analytics";
import {Slugs} from "polar-shared/src/util/Slugs";
import {MUIDialog} from "../../ui/dialogs/MUIDialog";
import { useHistory } from 'react-router-dom';
import {useComponentDidMount} from "../../hooks/ReactLifecycleHooks";
import {PolarLogoImage} from "../../../../apps/repository/js/nav/PolarLogoImage";
import {PolarLogoText} from "../../../../apps/repository/js/nav/PolarLogoText";
import {WelcomeScreenContent} from "./WelcomeScreenContent";
import Box from '@material-ui/core/Box';

export const WelcomeScreen = React.memo(function WelcomeScreen() {

    const analytics = useAnalytics();
    const history = useHistory();

    const handleProfile = React.useCallback((profile: OccupationProfile) => {

        analytics.traits({
            user_occupation: profile.occupation.id
        })

        if (isAcademicOccupationProfile(profile)) {
            analytics.traits({
                user_field_of_study: profile.fieldOfStudy.id,
                user_university_id: profile.university.id,
                user_university_name_slug: Slugs.calculate(profile.university.name),
                user_university_domain: profile.university.domain
            });
        }

        analytics.event2('welcome-profile-completed', {
            ...profile
        });

        history.replace('/');

    }, [analytics, history]);

    const handleClose = React.useCallback(() => {
        analytics.event2('welcome-profile-skipped');
        history.replace('/');
    }, [analytics, history]);

    useComponentDidMount(() => {
        analytics.event2('welcome-screen-triggered');
    });

    return (
        <MUIDialog open={true} onClose={handleClose} maxWidth="lg">

            <Box style={{
                     minHeight: '600px',
                     display: 'flex'
                 }}>
                <WelcomeScreenContent onProfile={handleProfile}/>
            </Box>

        </MUIDialog>
    );

})
