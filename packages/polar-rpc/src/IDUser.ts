import {EmailStr, UserIDStr} from "polar-shared/src/util/Strings";

export interface IUserRecord {
    readonly uid: UserIDStr;
    readonly email: EmailStr;
}

export interface IDUser {
    readonly uid: UserIDStr;
    readonly user: IUserRecord;
}
