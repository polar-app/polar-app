import * as React from 'react';
import {Button} from "reactstrap";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Strings} from "polar-shared/src/util/Strings";

export class ReviewFinished extends React.Component<IProps> {

    public render() {

        return (
            <div>
                <div className="text-center">
                    <h2>Review Finished</h2>
                </div>


                <div className="text-center">

                    <Button color="primary"
                            size="lg">
                        OK
                    </Button>

                </div>

            </div>
        );
    }

}

export interface IProps {

}
