import React from 'react';
import {useFirestorePrefs} from "../../../../apps/repository/js/persistence_layer/FirestorePrefs";
import {useErrorHandler} from "../../mui/useErrorHandler";
import {FreePremiumWithReferralBannerContent} from "./FreePremiumWithReferralBannerContent";

const key = 'free-premium-with-referral-banner-closed';

export const FreePremiumWithReferralBanner = () => {

    const errorHandler = useErrorHandler();
    const prefs = useFirestorePrefs();

    const active = React.useMemo(() => ! prefs.isMarked(key), [prefs]);

    const handleClose = React.useCallback(() => {

        prefs.mark(key, true);
        prefs.commit()
            .catch(err => errorHandler("Could not write prefs: ", err));

    }, [errorHandler, prefs]);

    if (! active) {
        return null;
    }

    return (
        <FreePremiumWithReferralBannerContent onClose={handleClose}/>
    );

}
