import * as React from "react";
import {UniversitySelect} from "../../../apps/repository/js/configure/profile/selectors/UniversitySelect";
import {FieldOfStudySelect} from "../../../apps/repository/js/configure/profile/selectors/FieldOfStudySelect";
import {OccupationSelect} from "../../../apps/repository/js/configure/profile/selectors/OccupationSelect";
import {ProfileConfigurator} from "../../../apps/repository/js/configure/profile/ProfileConfigurator";


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
        <ProfileConfigurator onOccupationProfile={profile => console.log("GOT PROFILE: ", {profile})}/>
    </div>
);

