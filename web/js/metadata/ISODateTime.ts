/**
 *
 * Basic ISO8601 date and time format.
 */
export class ISODateTime {

    public static EPOCH: ISODateTime = new ISODateTime(new Date(0));

    public readonly value: string;

    constructor(val: any) {

        if (typeof val === "string") {
            this.value = val;
        } else if(val instanceof Date) {
            this.value = val.toISOString();
        } else if(val instanceof ISODateTime) {
            this.value = val.value;
        } else if(typeof val === "object" && typeof val.value === "string") {
            // typescript serialized objects.
            this.value = val.value;
        } else {
            throw new Error("Invalid type: " + typeof val);
        }

    }

    toDate(): Date {
        return new Date(Date.parse(this.value));
    }

    toJSON(): string {
        return this.value;
    }

    toString(): string {
        return this.value;
    }

    equals(obj: any): boolean {

        if(! (obj instanceof ISODateTime)) {
            return false;
        }

        return this.value === obj.value;

    }

    /**
     * Create a duplicate version of this object.
     */
    duplicate(): ISODateTime {
        return new ISODateTime(this.value);
    }

}
