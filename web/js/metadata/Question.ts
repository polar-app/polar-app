/**
 * Some type of follow up on content that we need to analyze.
 */
import {INote, Note} from './Note';

export class Question extends Note {

    constructor(val: any) {

        super(val);

        this.init(val);

    }

}

export interface IQuestion extends INote {

}
