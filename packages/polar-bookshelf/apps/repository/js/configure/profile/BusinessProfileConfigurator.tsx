import * as React from "react";
import Input from "reactstrap/lib/Input";
import {URLStr} from "polar-shared/src/util/Strings";
import {Occupation} from "./selectors/OccupationSelect";
import {BusinessProfile, FormData} from "./ProfileConfigurator";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Percentages} from "polar-shared/src/util/Percentages";

interface IProps {

    readonly occupation: Occupation;
    readonly form: FormData<BusinessProfile>;
    readonly onForm: (form: FormData<BusinessProfile>) => void;

}

export const BusinessProfileConfigurator = (props: IProps) => {

    const onForm = (newProfile: Partial<BusinessProfile>) => {

        const profile = {
            ...props.form.profile,
            ...newProfile
        };

        const computeProgress = () => {

            const tasks = [
                profile.domain,
            ];

            const score = arrayStream(tasks)
                .filter(current => current !== undefined)
                .collect()
                .length;

            return Percentages.calculate(score + 1, tasks.length);

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
                domainOrURL: url,
                domain: parsedURL.hostname
            });

        } catch (e) {
            // noop as this is an invalid URL so far.
        }

    };

    return (

        <div className="mb-1 mt-2">

            <div className="mb-1 font-weight-bold">
                What's the URL for your company?
            </div>

            <div className="mt-1">
                <Input type="url" onChange={event => onURL(event.currentTarget.value)}/>
            </div>

        </div>
    );

};
