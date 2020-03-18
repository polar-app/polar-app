import * as React from "react";
import {UniversitySelect} from "./UniversitySelect";
import {FieldOfStudySelect} from "./FieldOfStudySelect";
import { OccupationSelect } from "./OccupationSelect";

export const SchoolSelectDemo = () => (

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

