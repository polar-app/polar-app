import {RepoDocInfo} from './RepoDocInfo';

export interface AppState {

    // docs: DocDetail[];

    data: RepoDocInfo[];
    selected?: number;
}

