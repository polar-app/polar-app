import {Step} from 'react-joyride';

export class JoyrideTours {

}


/**
 * An enhanced step with a few more fields.
 */
export interface EnhancedStep extends Step {

    /**
     * True when we should go the next step as soon as its selector is available.
     */
    readonly autoNext?: boolean;

}
