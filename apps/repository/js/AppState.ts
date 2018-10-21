import {RepoDocInfo} from './RepoDocInfo';
import {ListOptionType} from '../../../web/js/ui/list_selector/ListSelector';
import {TableColumns} from './TableColumns';

export interface AppState {

    // docs: DocDetail[];

    data: RepoDocInfo[];
    columns: TableColumns;
    selected?: number;
}

