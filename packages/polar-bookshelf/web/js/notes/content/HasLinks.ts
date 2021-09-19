import {IHasLinksContent} from "polar-blocks/src/blocks/content/IHasLinksContent";
import {BlockIDStr, IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {observable, computed, makeObservable} from "mobx";

export class HasLinks implements IHasLinksContent {
    @observable private _links: ReadonlyArray<IBlockLink>;

    constructor(props: IHasLinksContent) {
        this._links = props.links || [];

        makeObservable(this);
    }

    @computed get links() {
        return this._links;
    }

    protected updateLinks(links: ReadonlyArray<IBlockLink>): void {
        this._links = links;
    }

    public addLink(link: IBlockLink) {
        this._links = [...this.links, link];
    }

    public removeLink(id: BlockIDStr) {
        const newLinks = [];
        let removed = false;

        // Only remove the first occurrence since we might have multiple links to the same block
        for (let link of this.links) {

            if (! removed && id === link.id) {
                removed = true;
                continue;
            }

            newLinks.push(link);
        }

        this._links = newLinks;
    }

}
