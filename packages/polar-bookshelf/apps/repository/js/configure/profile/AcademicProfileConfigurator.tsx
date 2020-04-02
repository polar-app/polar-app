import * as React from "react";
import {EducationLevelSelect} from "./selectors/EducationLevelSelect";
import {FieldOfStudySelect} from "./selectors/FieldOfStudySelect";
import {NullCollapse} from "../../../../../web/js/ui/null_collapse/NullCollapse";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {UniversitySelect} from "./selectors/UniversitySelect";
import {AcademicOccupationProfile, FormData} from "./ProfileConfigurator";
import {Percentages} from "polar-shared/src/util/Percentages";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {
    AcademicOccupation,
    Occupation
} from "polar-shared/src/util/Occupations";

interface IProps {

    readonly occupation: Occupation;
    readonly form: FormData<AcademicOccupationProfile>;

    readonly onForm: (form: FormData<AcademicOccupationProfile>) => void;

}

export const AcademicProfileConfigurator = (props: IProps) => {

    const onForm = (newProfile: Partial<AcademicOccupationProfile>) => {

        const occupation = props.occupation as AcademicOccupation;

        const profile: Partial<AcademicOccupationProfile> = {
            occupation,
            ...props.form.profile,
            ...newProfile
        };

        const computeProgress = () => {

            const tasks = [
                props.occupation,
                profile.educationLevel,
                profile.fieldOfStudy,
                profile.university
            ];

            const score = arrayStream(tasks)
                .filter(current => current !== undefined)
                .collect()
                .length;

            return Percentages.calculate(score, tasks.length);

        };

        const progress = computeProgress();

        props.onForm({
            ...props.form,
            profile,
            progress
        });

    };

    return (
        <div>
            <NullCollapse open={props.occupation !== undefined}>

                <div className="mb-1 mt-2">

                    <div className="mb-1 font-weight-bold">
                        At what level of education?
                    </div>

                    <div className="mt-1">
                        <EducationLevelSelect
                            placeholder="Bachelors, Masters, Doctorate, etc."
                            onSelect={selected => onForm({educationLevel: nullToUndefined(selected?.value)})}/>
                    </div>

                </div>

            </NullCollapse>

            <NullCollapse
                open={props.form.profile.educationLevel !== undefined}>

                <div className="mb-1 mt-2">

                    <div className="mb-1 font-weight-bold">
                        In what field?
                    </div>

                    <div className="mt-1">
                        <FieldOfStudySelect
                            placeholder=""
                            onSelect={selected => onForm({fieldOfStudy: nullToUndefined(selected?.value)})}/>
                    </div>

                </div>
            </NullCollapse>

            <NullCollapse open={props.form.profile.fieldOfStudy !== undefined}>

                <div className="mb-1 mt-2">

                    <div className="mb-1 font-weight-bold">
                        And at what school/university?
                    </div>

                    <UniversitySelect
                        placeholder="Type to search for your university..."
                        onSelect={selected => onForm({university: nullToUndefined(selected?.value)})}/>

                </div>

            </NullCollapse>
        </div>
    );
};
