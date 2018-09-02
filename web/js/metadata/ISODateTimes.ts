import {ISODateTime} from './ISODateTime';

export class ISODateTimes {
    public static create() {
        return new ISODateTime(new Date());
    }
}
