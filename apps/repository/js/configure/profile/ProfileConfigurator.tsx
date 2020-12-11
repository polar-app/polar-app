import {
    OccupationSelect
} from "./selectors/OccupationSelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {default as React, useState} from "react";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {URLStr} from "polar-shared/src/util/Strings";
import {AcademicProfileConfigurator} from "./AcademicProfileConfigurator";
import {BusinessProfileConfigurator} from "./BusinessProfileConfigurator";
import {
    AcademicOccupation,
    BusinessOccupation,
    Occupation
} from "polar-shared/src/util/Occupations";
import {FieldOfStudy} from "polar-shared/src/util/FieldOfStudies";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";

export interface AcademicOccupationProfile {
    readonly occupation: AcademicOccupation;
    // readonly educationLevel: EducationLevel;
    readonly fieldOfStudy: FieldOfStudy;
    readonly university: University;
}

export interface BusinessOccupationProfile {
    readonly occupation: BusinessOccupation;
    readonly domainOrURL: URLStr | DomainNameStr;
    readonly domain: DomainNameStr;
}

// TODO:
//
// - should we have 'personal' accounts and company ones and differentiate?
// - does the 'domain' conflict with 'links' in the profile?
//

// - FIXME: ok.. another major probem... we should have a separate configuration
// for their education because just because they're not a student DOES NOT mean
// they lack a professional education.

// - FIXME: ok... what about self-taught people... should we allow them to specify
// an equivalent level of study?

// - FIXME: completed level of education... if only high school we will need to have
// that to and right now we only have universities.  And there isn't an 'other'
// option there either.
//
// - FIXME: if they're pursing a masters we can't assume they received an
//  undergraduate from that university for example.
//
// - FIXME: should we only have them specify their highest completed level of
//   education.
//
// - FIXME: we definitely should NOT just limit the education to not include
//   a univer¡sity in the business profile.

export type OccupationProfile = AcademicOccupationProfile | BusinessOccupationProfile;

interface IProps {
    readonly onOccupationProfile: (occupationProfile: OccupationProfile) => void;
}

export interface FormData<T> {
    readonly profile: Partial<T>;
    readonly progress: number;
}

interface IState {
    readonly occupation?: Occupation;
    readonly form: FormData<AcademicOccupationProfile> | FormData<BusinessOccupationProfile>;
}

export const ProfileConfigurator = (props: IProps) => {

    const [state, setState] = useState<IState>({
        form: {
            profile: {},
            progress: 0
        }
    });

    const onOccupation = (occupation: Occupation | undefined) => {
        console.log("occupation: ", occupation);

        const computeProgress = () => {
            switch (occupation?.type) {

                case "academic":
                    return 25;
                case "business":
                    return 50;
                default:
                    return 0;
            }
        };

        const progress = computeProgress();

        const newState = {
            ...state,
            form: {
                ...state.form,
                progress
            },
            occupation
        };

        setState(newState);
    };

    const onForm = (form: FormData<AcademicOccupationProfile> | FormData<BusinessOccupationProfile>) => {
        console.log("form: "    , form);
        setState({...state, form});

        if (form.progress === 100) {

            switch (state.occupation?.type) {

                case "academic":
                    props.onOccupationProfile(form.profile as AcademicOccupationProfile);
                    break;
                case "business":
                    props.onOccupationProfile(form.profile as BusinessOccupationProfile);
                    break;

            }

        }

    };

    return (
        <div style={{
                 minHeight: '30em',
                 display: 'flex',
                 flexDirection: 'column'
             }}
             className="">

            <Box style={{flexGrow: 1}}>

                <div className="mb-1">
                    <LinearProgress variant="determinate"
                                    value={state.form.progress}/>
                </div>

                <div style={{textAlign: 'center'}}>

                    <h2>Tell us about yourself!</h2>

                    <Box color="text.secondary">
                        We use this information to improve Polar specifically
                        for your use case when incorporating your feedback and
                        prioritizing new features.
                    </Box>

                </div>

                <Box mt={3}
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         justifyContent: 'flex-center'
                     }}>

                    <Box m={2}>

                        <OccupationSelect
                            placeholder="Pick one from the list or create one if necessary."
                            onSelect={selected => onOccupation(nullToUndefined(selected?.value))}/>

                    </Box>

                    {state.occupation && state.occupation.type === 'academic' &&
                        <AcademicProfileConfigurator occupation={state.occupation}
                                                     form={state.form as FormData<AcademicOccupationProfile>}
                                                     onForm={form => onForm(form)}/>}

                    {state.occupation && state.occupation.type === 'business' &&
                        <BusinessProfileConfigurator occupation={state.occupation}
                                                     form={state.form as FormData<BusinessOccupationProfile>}
                                                     onForm={form => onForm(form)}/>}

                </Box>
            </Box>

        </div>
    );

};
