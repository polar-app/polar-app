import {IHasLinksContent} from "polar-blocks/src/blocks/content/IHasLinksContent";
import {BlockIDStr, IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {observable, computed, makeObservable} from "mobx";
import {Tag} from "polar-shared/src/tags/Tags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export const TAG_IDENTIFIER = '#';

export class HasLinks implements IHasLinksContent {
    @observable private _links: ReadonlyArray<IBlockLink>;

    constructor(props: IHasLinksContent) {
        this._links = props.links || [];

        makeObservable(this);
    }

    @computed get links() {
        return this._links;
    }

    @computed get wikiLinks() {
        return this._links.filter(({ text }) => ! text.startsWith(TAG_IDENTIFIER));
    }

    @computed get tagLinks() {
        return this._links.filter(({ text }) => text.startsWith(TAG_IDENTIFIER));
    }

    public getTags(): Tag[] {
        const toTag = ({ text }: IBlockLink): Tag => {
            const label = text.slice(1);
            return { label, id: label };
        };

        return this.tagLinks.map(toTag);
    }

    public getTagsMap(): Record<string, Tag> {
        return arrayStream(this.getTags())
            .toMap(({ label }) => label);
    }

    public updateLinks(links: ReadonlyArray<IBlockLink>): void {
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
