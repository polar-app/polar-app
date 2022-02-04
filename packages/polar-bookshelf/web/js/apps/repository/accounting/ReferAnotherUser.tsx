import React, {useEffect, useState} from "react";
import {IFirestoreContext, useFirestore} from "../../../../../apps/repository/js/FirestoreProvider";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {TextField} from "@material-ui/core";
import {Feature, FeatureEnabled, useFeatureEnabled} from "../../../features/FeaturesRegistry";

const getOrCreateReferralCode = (firestore: IFirestoreContext) => {
    const REF_CODES_COLLECTION = 'user_referral';
    const REF_CODE_CHAR_LENGTH = 10;

    return new Promise<string>(resolve => {
        firestore.firestore
            .collection(REF_CODES_COLLECTION)
            .where('uid', '==', firestore.uid)
            .onSnapshot(snapshot => {
                // If the referral code was previous created, just return it
                const existingReferralCode = snapshot.docs.length > 0
                    ? snapshot.docs.find(() => true)!.get('referral_code') as string
                    : undefined;

                if (existingReferralCode) {
                    resolve(existingReferralCode);
                    return;
                }

                // If a previous referral code doesn't exist, create it now and return it
                const referral_code = Hashcodes.createRandomID({len: REF_CODE_CHAR_LENGTH})

                firestore.firestore
                    .collection(REF_CODES_COLLECTION)
                    .doc(firestore.uid)
                    .set({
                        uid: firestore.uid,
                        referral_code,
                        created_at: Math.round(new Date().getTime() / 1000),
                    })
                    .then(() => {
                        resolve(referral_code);
                    });
            });
    });
}

const ReferAnotherUser: React.FC = () => {
    const featureEnabled = useFeatureEnabled('referral-system');
    if (!featureEnabled) {
        return <>Feature not enabled</>;
    }

    const firestore = useFirestore();
    const [referralURL, setReferralURL] = useState<string>('');

    useEffect(() => {
        getOrCreateReferralCode(firestore).then(referralCode => setReferralURL(`https://app.getpolarized.io/join/${referralCode}`));
    }, [firestore]);

    if (!referralURL) {
        return <></>;
    }

    return <>
        <p>Here's your referral URL. Share it with your friends and spread the love about Polar!</p>
        <TextField disabled={true} value={referralURL}/>
    </>
}
export default ReferAnotherUser;
