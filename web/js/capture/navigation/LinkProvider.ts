import {BrowserProfileID} from '../BrowserProfile';

export interface LinkProvider {

    get(browserProfileID: BrowserProfileID): Promise<string>;

}
