import {IDStr} from "./Strings";

export type TwoLetterCountryCode = string;

export type CountryNameStr = string;
export type DomainNameStr = string;

export interface Country {
    readonly code: TwoLetterCountryCode;
    readonly name: CountryNameStr;
}

export interface University {
    readonly name: string;
    readonly domains: ReadonlyArray<DomainNameStr>;
    readonly country: Country;
    readonly domain: string;
    readonly id: IDStr;
}

