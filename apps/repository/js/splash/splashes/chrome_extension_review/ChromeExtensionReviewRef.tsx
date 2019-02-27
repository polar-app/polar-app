import * as React from 'react';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {ChromeExtensionReview} from './ChromeExtensionReview';

export class ChromeExtensionReviewRef extends ConditionalPrioritizedComponentRef {

    public readonly id = 'chrome-extension-review';

    constructor() {
        super('chrome-extension-review', 30);
    }

    public create(): JSX.Element {
        return <ChromeExtensionReview settingKey={this.settingKey}/>;
    }

}
