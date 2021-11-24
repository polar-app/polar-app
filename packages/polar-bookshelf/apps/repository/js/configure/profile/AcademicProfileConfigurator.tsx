import * as React from "react";
import {FieldOfStudySelect} from "./selectors/FieldOfStudySelect";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {AcademicOccupationProfileV0, FormData} from "./ProfileConfigurator";
import {Percentages} from "polar-shared/src/util/Percentages";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {AcademicOccupation, Occupation} from "polar-shared/src/util/Occupations";
import Box from "@material-ui/core/Box";

interface IProps {

    readonly occupation: Occupation;
    readonly form: FormData<AcademicOccupationProfileV0>;

    readonly onForm: (form: FormData<AcademicOccupationProfileV0>) => void;

}

export const AcademicProfileConfigurator = React.memo(function AcademicProfileConfigurator(props: IProps) {

    const onForm = (newProfile: Partial<AcademicOccupationProfileV0>) => {

        const occupation = props.occupation as AcademicOccupation;

        const profile: Partial<AcademicOccupationProfileV0> = {
            ver: 'v0',
            occupation,
            ...props.form.profile,
            ...newProfile
        };

        const computeProgress = () => {

            const tasks = [
                props.occupation,
                profile.fieldOfStudy,
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
        <>

            <Box m={2} style={{ flexGrow: 1 }}>
                <FieldOfStudySelect
                    placeholder=""
                    onSelect={selected => onForm({fieldOfStudy: nullToUndefined(selected?.value)})}/>
            </Box>

            {/*{props.form.profile.fieldOfStudy !== undefined && (*/}
            {/*    <Box m={2} style={{ flexGrow: 1 }}>*/}
            {/*        <UniversitySelect onSelect={selected => onForm({university: nullToUndefined(selected?.value)})}/>*/}
            {/*    </Box>*/}
            {/*)}*/}

        </>
    );
});
