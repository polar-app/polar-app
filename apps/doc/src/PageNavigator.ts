export interface PageNavigator {
    readonly get: () => number;
    readonly set: (page: number) => void;
}
