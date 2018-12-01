import * as React from 'react';
import {PrioritizedComponentRef} from "../../../../../../web/js/ui/prioritized/PrioritizedComponentManager";
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {Survey} from './Survey';

export class SurveyRef extends ConditionalPrioritizedComponentRef {

    constructor() {
        super('survey', 30);
    }

    public create(): JSX.Element {
        return <Survey settingKey={this.settingKey}/>;
    }

}
