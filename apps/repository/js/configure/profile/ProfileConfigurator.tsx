import {Occupation, OccupationSelect} from "./OccupationSelect";
import {EducationLevel, EducationLevelSelect} from "./EducationLevelSelect";
import {FieldOfStudy, FieldOfStudySelect} from "./FieldOfStudySelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {default as React, useState} from "react";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Progress} from "reactstrap";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {NullCollapse} from "../../../../../web/js/ui/null_collapse/NullCollapse";
import {UniversitySelect} from "./UniversitySelect";
import {URLStr} from "polar-shared/src/util/Strings";

// FIXME: now this conflicts with 'profile' in the database and I think we
// should use that...

export type ProfileType = 'academic' | 'business' | 'personal';

export interface AcademicProfile {
    readonly type: 'academic';
    readonly occupation: Occupation;
    readonly educationLevel?: EducationLevel;
    readonly fieldOfStudy: FieldOfStudy;
    readonly university: University;
}

export interface BusinessProfile {
    readonly type: 'business';
    readonly occupation: Occupation;
    readonly domainOrURL: URLStr | DomainNameStr;
    readonly domain: DomainNameStr;
}

export interface PersonalProfile {
    readonly type: 'personal';
    readonly occupation: Occupation;
}

export type Profile = AcademicProfile;

interface IProps {
    readonly onProfile: (profile: Profile) => void;
}

interface IState {
    readonly occupation?: Occupation;
    readonly educationLevel?: EducationLevel;
    readonly fieldOfStudy?: FieldOfStudy;
    readonly university?: University;
}

export const ProfileConfigurator = (props: IProps) => {
    const [state, setState] = useState<IState>({});

    const onOccupation = (occupation: Occupation | undefined) => {
        setState({...state, occupation});
    };

    const onEducationLevel = (educationLevel: EducationLevel | undefined) => {
        setState({...state, educationLevel});
    };

    const onFieldOfStudy = (fieldOfStudy: FieldOfStudy | undefined) => {
        setState({...state, fieldOfStudy});
    };

    const onUniversity = (university: University | undefined) => {
        setState({...state, university});
    };

    const computeProgress = () => {

        const score = arrayStream([
            state.occupation,
            state.educationLevel,
            state.fieldOfStudy,
            state.university
        ])
            .filter(current => current !== undefined)
            .collect()
            .length;

        return Percentages.calculate(score, 4);

    };

    const progress = computeProgress();

    return (
        <div style={{
            minHeight: '30em',
            display: 'flex',
            flexDirection: 'column'
        }}
             className="">

            <div style={{flexGrow: 1}}>

                <div className="mb-1">
                    <Progress value={progress}/>
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
                        placeholder=""
                        onSelect={selected => onOccupation(nullToUndefined(selected?.value))}/>
                </div>

                <NullCollapse open={state.occupation !== undefined}>

                    <div className="mb-1 mt-2">

                        <div className="mb-1 font-weight-bold">
                            At what level of education?
                        </div>

                        <div className="mt-1">
                            <EducationLevelSelect
                                placeholder=""
                                onSelect={selected => onEducationLevel(nullToUndefined(selected?.value))}/>
                        </div>

                    </div>
                </NullCollapse>

                <NullCollapse open={state.educationLevel !== undefined}>

                    <div className="mb-1 mt-2">

                        <div className="mb-1 font-weight-bold">
                            What do you study?
                        </div>

                        <div className="mt-1">
                            <FieldOfStudySelect
                                placeholder=""
                                onSelect={selected => onFieldOfStudy(nullToUndefined(selected?.value))}/>
                        </div>

                    </div>
                </NullCollapse>

                <NullCollapse open={state.fieldOfStudy !== undefined}>

                    <div className="mb-1 mt-2">

                        <div className="mb-1 font-weight-bold">
                            ... and at what school/university?
                        </div>

                        <UniversitySelect
                            placeholder=""
                            onSelect={selected => onUniversity(nullToUndefined(selected?.value))}/>

                    </div>

                </NullCollapse>
            </div>

        </div>
    );

};
