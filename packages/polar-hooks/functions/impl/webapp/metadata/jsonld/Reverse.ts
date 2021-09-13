import {BaseType} from "./BaseType";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IPerson} from "./Person";

export interface IReverse {

    readonly "@id": string;

}

export type ReverseMap = {[field: string]: IReverse};
