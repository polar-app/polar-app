import * as React from "react";
import {UniversitySelect} from "./UniversitySelect";
import {FieldOfStudy, FieldOfStudySelect} from "./FieldOfStudySelect";
import {Occupation, OccupationSelect} from "./OccupationSelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {useState} from "react";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {NullCollapse} from "../../js/ui/null_collapse/NullCollapse";
import {URLStr} from "polar-shared/src/util/Strings";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Progress, Button} from "reactstrap";
import {UniversityLevel, UniversityLevelSelect} from "./UniversityLevelSelect";

export type ProfileType = 'academic' | 'business' | 'personal';

export interface AcademicProfile {
    readonly type: 'academic';
    readonly occupation: Occupation;
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
    readonly universityLevel?: UniversityLevel;
    readonly fieldOfStudy?: FieldOfStudy;
    readonly university?: University;
}

export const ProfileConfigurator = (props: IProps) => {
    const [state, setState] = useState<IState>({});

    const onOccupation = (occupation: Occupation | undefined) => {
        setState({...state, occupation});
    };

    const onUniversityLevel = (universityLevel: UniversityLevel | undefined) => {
        setState({...state, universityLevel});
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
                            state.universityLevel,
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
             className="border rounded p-1">

            <div style={{flexGrow: 1}}>

                <div className="mb-1">
                    <Progress value={progress}/>
                </div>

                <p>
                    <b>Tell us about yourself! </b> We just want to ask you a few
                    questions to better tailor your experience.
                </p>

                <div className="mt-1">

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
                            At what university level?
                        </div>

                        <div className="mt-1">
                            <UniversityLevelSelect
                                placeholder=""
                                onSelect={selected => onUniversityLevel(nullToUndefined(selected?.value))}/>
                        </div>

                    </div>
                </NullCollapse>

                <NullCollapse open={state.universityLevel !== undefined}>

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
                            Select a university:
                        </div>

                        <UniversitySelect
                            onSelect={selected => onUniversity(nullToUndefined(selected?.value))}/>

                    </div>

                </NullCollapse>
            </div>

            {/*<div className="text-center mt-2">*/}

            {/*    <Button hidden={progress === 100}*/}
            {/*            color="clear"*/}
            {/*            size="md">*/}
            {/*        Skip*/}
            {/*    </Button>*/}

            {/*    <Button hidden={progress !== 100}*/}
            {/*            color="primary"*/}
            {/*            size="lg">*/}
            {/*        Let's Go!*/}
            {/*    </Button>*/}

            {/*</div>*/}

        </div>
    );

};

export const SchoolSelectDemo2 = () => (

    <div>

        <div className="m-1">
            <OccupationSelect
                onSelect={selected => console.log({selected})}/>
        </div>

        <div className="m-1">
            <FieldOfStudySelect onSelect={selected => console.log({selected})}/>
        </div>

        <div className="m-1">


            <UniversitySelect onSelect={selected => console.log({selected})}/>
        </div>

    </div>
);

export const SchoolSelectDemo = () => (

    <div>
        <ProfileConfigurator onProfile={profile => console.log({profile})}/>
    </div>
);

