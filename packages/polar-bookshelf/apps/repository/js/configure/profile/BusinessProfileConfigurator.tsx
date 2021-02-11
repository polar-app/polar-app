import * as React from "react";
import {URLStr} from "polar-shared/src/util/Strings";
import {BusinessOccupationProfile, FormData} from "./ProfileConfigurator";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Percentages} from "polar-shared/src/util/Percentages";
import {
    BusinessOccupation,
    Occupation
} from "polar-shared/src/util/Occupations";
import Input from "@material-ui/core/Input";

interface IProps {

    readonly occupation: Occupation;
    readonly form: FormData<BusinessOccupationProfile>;
    readonly onForm: (form: FormData<BusinessOccupationProfile>) => void;

}

export const BusinessProfileConfigurator = (props: IProps) => {

    const onForm = (newProfile: Partial<BusinessOccupationProfile>) => {

        const occupation = props.occupation as BusinessOccupation;

        const profile = {
            occupation,
            ...props.form.profile,
            ...newProfile
        };

        const computeProgress = () => {

            const tasks = [
                props.occupation,
                // profile.domain,
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

    const onURL = (url: URLStr) => {

        try {
            const parsedURL = new URL(url);

            onForm({
                // domainOrURL: url,
                // domain: parsedURL.hostname
            });

        } catch (e) {
            // noop as this is an invalid URL so far.
            onForm({
                // domainOrURL: undefined,
                // domain: undefined
            });
        }

    };

    return (

        <div className="mb-1 mt-2">

            <div className="mb-1 font-weight-bold">
                What's the URL for your company?
            </div>

            <div className="mt-1">
                <Input type="url"
                       autoFocus={true}
                       onChange={event => onURL(event.currentTarget.value)}/>
            </div>

        </div>
    );

};
