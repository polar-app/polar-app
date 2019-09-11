import {ContentGenerator} from "../../../../../polar-shared-webserver/src/webserver/Rewrites";

export class Rewrites {

    public static matchesRegex(regex: URLRegularExpressionStr, path: PathStr): boolean {

        const re = new RegExp(regex);
        const matches = re.exec(path);

        if (matches && matches[0] === path) {
            return true;
        }

        return false;

    }

}


export interface Rewrite {
    readonly source: string;
    readonly destination: string | ContentGenerator;
}

export type PathStr = string;

export type RegexStr = string;
export type URLRegularExpressionStr = RegexStr;

export type Predicate<V, R> = (value: V) => R;

export type RewritePredicate = Predicate<string, Rewrite>;

class RewritePredicates {

    public static create(rewrite: Rewrite) {

    }

}
