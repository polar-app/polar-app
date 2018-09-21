import {BrowserWindow} from 'electron';
import searchInPage from 'electron-in-page-search';

export class InPageSearch {

    public static execute() {
        const webContents = BrowserWindow.getFocusedWindow()!.webContents;
        const inPageSearch = searchInPage(webContents);
        inPageSearch.openSearchWindow();
    }

}
