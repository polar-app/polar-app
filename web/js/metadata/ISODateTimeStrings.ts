
export type ISODateTimeString = string;

export class ISODateTimeStrings {

    public static create(): ISODateTimeString {
        return new Date().toISOString();
    }

}

