/**
 *
 * Basic ISO8601 date and time format.
 */
export class ISODateTime {

    public readonly value: string;

    constructor(val: any) {

        if (typeof val === "string") {
            this.value = val;
        } else if (val instanceof Date) {
            this.value = val.toISOString();
        } else if (val instanceof ISODateTime) {
            this.value = val.value;
        } else if (typeof val === "object" && typeof val.value === "string") {
            // typescript serialized objects.
            this.value = val.value;
        } else {
            throw new Error("Invalid type: " + typeof val);
        }

    }

    public toDate(): Date {
        return new Date(Date.parse(this.value));
    }

    public toJSON(): string {
        return this.value;
    }

    public toString(): string {
        return this.value;
    }

    public equals(obj: any): boolean {

        if (! (obj instanceof ISODateTime)) {
            return false;
        }

        return this.value === obj.value;

    }

    /**
     * Create a duplicate version of this object.
     */
    public duplicate(): ISODateTime {
        return new ISODateTime(this.value);
    }

    public static EPOCH: ISODateTime = new ISODateTime(new Date(0));

}
