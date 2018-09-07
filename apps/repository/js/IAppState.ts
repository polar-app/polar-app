import {RepoDocInfo} from './RepoDocInfo';

export interface IAppState {

    // docs: DocDetail[];

    data: RepoDocInfo[];
    selected?: number;
}

