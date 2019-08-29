export class Rewrites {

    public static matchesRegex(regex: URLRegularExpressionStr, path: PathStr): boolean {
        const re = new RegExp(regex);
        return re.test(path);
    }

}

export interface Rewrite {
    readonly source: string;
    readonly destination: string;
}

export type PathStr = string;

export type RegexStr = string;
export type URLRegularExpressionStr = RegexStr;

