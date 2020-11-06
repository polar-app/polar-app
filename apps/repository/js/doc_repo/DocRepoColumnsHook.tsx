import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export function useDocRepoColumns(): ReadonlyArray<keyof IDocInfo> {
    return ['title', 'added', 'lastUpdated', 'tags', 'authors', 'progress'];
}