import * as React from "react";
import {UniversitySelect} from "./UniversitySelect";
import {FieldOfStudy, FieldOfStudySelect} from "./FieldOfStudySelect";
import {Occupation, OccupationSelect} from "./OccupationSelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {useState} from "react";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {NullCollapse} from "../../js/ui/null_collapse/NullCollapse";
import {URLStr} from "polar-shared/src/util/Strings";

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
    readonly fieldOfStudy?: FieldOfStudy;
    readonly university?: University;
}

export const ProfileConfigurator = (props: IProps) => {
    const [state, setState] = useState<IState>({});

    const onOccupation = (occupation: Occupation | undefined) => {
        setState({...state, occupation});
    };

    return (
        <div>

            <p>
                Tell us about yourself.
            </p>

            <div className="mt-1">
                <OccupationSelect onSelect={selected => onOccupation(nullToUndefined(selected?.value))}/>
            </div>

            <NullCollapse open={state.occupation !== undefined}>

                <div className="mt-1">
                    <FieldOfStudySelect onSelect={selected => console.log({selected})}/>
                </div>

                <div className="mt-2">

                    <div className="mb-1">
                        Select a university:
                    </div>

                    <UniversitySelect onSelect={selected => console.log({selected})}/>
                </div>

            </NullCollapse>

        </div>
    );

};

export const SchoolSelectDemo2 = () => (

    <div>

        <div className="m-1">
            <OccupationSelect onSelect={selected => console.log({selected})}/>
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

