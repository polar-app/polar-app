import * as React from 'react';
import {GithubStars} from './GithubStars';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';

export class GithubStarsRef extends ConditionalPrioritizedComponentRef {

    constructor() {
        super('github-stars', 20);
    }

    public create(): JSX.Element {
        return <GithubStars settingKey={this.settingKey}/>;
    }

}
