/**
 * Basically just like a note but it's a comment in a discussion stream.
 */
import {INote, Note} from './Note';

export class Comment extends Note implements IComment {

    constructor(val: any) {
        super(val);
    }

}

export interface IComment extends INote {

}
