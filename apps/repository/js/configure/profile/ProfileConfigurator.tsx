import {
    AcademicOccupation,
    BusinessOccupation,
    Occupation,
    OccupationSelect
} from "./selectors/OccupationSelect";
import {EducationLevel} from "./selectors/EducationLevelSelect";
import {FieldOfStudy} from "./selectors/FieldOfStudySelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {default as React, useState} from "react";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Progress} from "reactstrap";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {URLStr} from "polar-shared/src/util/Strings";
import {AcademicProfileConfigurator} from "./AcademicProfileConfigurator";
import {BusinessProfileConfigurator} from "./BusinessProfileConfigurator";

// FIXME: now this conflicts with 'profile' in the database and I think we
// should use that...
//
// FIXME: we can't call 'profile' 'occupation' because that's a field in profile

export interface AcademicProfile {
    readonly occupation: AcademicOccupation;
    readonly educationLevel: EducationLevel;
    readonly fieldOfStudy: FieldOfStudy;
    readonly university: University;
}

export interface BusinessProfile {
    readonly occupation: BusinessOccupation;
    readonly domainOrURL: URLStr | DomainNameStr;
    readonly domain: DomainNameStr;
}

export type OccupationProfile = AcademicProfile | BusinessProfile;

interface IProps {
    readonly onOccupationProfile: (occupationProfile: OccupationProfile) => void;
}

export interface FormData<T> {
    readonly profile: Partial<T>;
    readonly progress: number;
}

interface IState {
    readonly occupation?: Occupation;
    readonly form: FormData<AcademicProfile> | FormData<BusinessProfile>;
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

    const onForm = (form: FormData<AcademicProfile> | FormData<BusinessProfile>) => {
        console.log("form: "    , form);
        setState({...state, form});
    };

    return (
        <div style={{
                 minHeight: '30em',
                 display: 'flex',
                 flexDirection: 'column'
             }}
             className="">

            <div style={{flexGrow: 1}}>

                <div className="mb-1">
                    <Progress value={state.form.progress}/>
                </div>

                <div className="font-weight-bold text-xl">Tell us about yourself! </div>

                <div className="text-muted text-lg mt-1 mb-1">
                    We use this information to improve Polar specifically
                    for your use case when incorporating your feedback and
                    prioritizing new features.
                </div>

                <div className="mt-2">

                    <div className="mb-1 font-weight-bold">
                        What's your occupation?
                    </div>

                    <OccupationSelect
                        placeholder="Pick one from the list or create one if necessary."
                        onSelect={selected => onOccupation(nullToUndefined(selected?.value))}/>
                </div>

                {state.occupation && state.occupation.type === 'academic' &&
                    <AcademicProfileConfigurator occupation={state.occupation}
                                                 form={state.form as FormData<AcademicProfile>}
                                                 onForm={form => onForm(form)}/>}

                {state.occupation && state.occupation.type === 'business' &&
                    <BusinessProfileConfigurator occupation={state.occupation}
                                                 form={state.form as FormData<BusinessProfile>}
                                                 onForm={form => onForm(form)}/>}

            </div>

        </div>
    );

};
