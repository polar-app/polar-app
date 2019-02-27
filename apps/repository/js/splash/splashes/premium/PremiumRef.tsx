import * as React from 'react';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {Premium} from './Premium';

export class PremiumRef extends ConditionalPrioritizedComponentRef {

    constructor() {
        super('premium', 40);
    }

    public create(): JSX.Element {
        return <Premium settingKey={this.settingKey}/>;
    }

}
