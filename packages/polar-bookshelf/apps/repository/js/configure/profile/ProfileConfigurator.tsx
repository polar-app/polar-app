import {
    OccupationSelect
} from "./selectors/OccupationSelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {default as React, useState} from "react";
import {Progress} from "reactstrap";
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
import {EducationLevel} from "polar-shared/src/util/EducationLevels";

export interface AcademicOccupationProfile {
    readonly occupation: AcademicOccupation;
    readonly educationLevel: EducationLevel;
    readonly fieldOfStudy: FieldOfStudy;
    readonly university: University;
}

export interface BusinessOccupationProfile {
    readonly occupation: BusinessOccupation;
    readonly domainOrURL: URLStr | DomainNameStr;
    readonly domain: DomainNameStr;
}

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
                                                 form={state.form as FormData<AcademicOccupationProfile>}
                                                 onForm={form => onForm(form)}/>}

                {state.occupation && state.occupation.type === 'business' &&
                    <BusinessProfileConfigurator occupation={state.occupation}
                                                 form={state.form as FormData<BusinessOccupationProfile>}
                                                 onForm={form => onForm(form)}/>}

            </div>

        </div>
    );

};
