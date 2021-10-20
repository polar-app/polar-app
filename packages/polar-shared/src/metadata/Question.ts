import {Note} from './Note';

/**
 * Some type of follow up on content that we need to analyze.
 */
export class Question extends Note {

    constructor(val: any) {

        super(val);

        this.init(val);

    }

}

