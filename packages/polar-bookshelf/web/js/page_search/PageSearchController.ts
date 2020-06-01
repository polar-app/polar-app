import searchInPage from 'electron-in-page-search';
import {remote} from 'electron';
import {Model} from '../model/Model';

export class PageSearchController {

    private model: Model;

    public constructor(model: Model) {
        this.model = model;
    }

    public start(): void {

        const inPageSearch = searchInPage(remote.getCurrentWebContents());

        // document.getElementById('some-button').addEventListener('click', () => {
        // inPageSearch.openSearchWindow();
        // });

    }

}
