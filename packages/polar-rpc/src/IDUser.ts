import {EmailStr, UIDStr} from "polar-shared/src/util/Strings";

export interface IUserRecord {
    readonly uid: UIDStr;
    readonly email: EmailStr;
}

export interface IDUser {
    readonly uid: UIDStr;
    readonly user: IUserRecord;
}
