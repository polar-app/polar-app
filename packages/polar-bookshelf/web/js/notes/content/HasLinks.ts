import {IHasLinksContent} from "polar-blocks/src/blocks/content/IHasLinksContent";
import {BlockIDStr, IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {computed, createAtom, IAtom, makeObservable, observable} from "mobx";
import {Tag} from "polar-shared/src/tags/Tags";
import deepEqual from "deep-equal";

export const TAG_IDENTIFIER = '#';

let atomSequence = 0;

export class HasLinks implements IHasLinksContent {

    @observable private _links: ReadonlyArray<IBlockLink>;

    protected _atom: IAtom;
    protected _observable = false;

    constructor(props: IHasLinksContent) {
        this._links = props.links || [];
        this._atom = createAtom(`HasLinks#${atomSequence++}`, () => this.convertToObservable())
    }

    @computed get links() {
        this._atom.reportObserved();

        return this._links;
    }

    @computed get wikiLinks() {
        this._atom.reportObserved();

        return this._links.filter(({ text }) => ! text.startsWith(TAG_IDENTIFIER));
    }

    @computed get tagLinks() {
        this._atom.reportObserved();

        return this._links.filter(({ text }) => text.startsWith(TAG_IDENTIFIER));
    }

    public hasTagsMutated(content: HasLinks): boolean {
        this._atom.reportObserved();

        return ! deepEqual(content.tagLinks, this.tagLinks);
    }

    public getTags(): Tag[] {
        this._atom.reportObserved();

        const toTag = ({ text, id }: IBlockLink): Tag => {
            const label = text.slice(1);
            return { label, id };
        };

        return this.tagLinks.map(toTag);
    }

    public updateLinks(links: ReadonlyArray<IBlockLink>): void {
        this._atom.reportObserved();

        this.convertToObservable();
        this._links = links;
    }

    public addLink(link: IBlockLink) {
        this._atom.reportObserved();

        this.convertToObservable();
        this._links = [...this.links, link];
    }

    public removeLink(id: BlockIDStr) {
        this._atom.reportObserved();

        this.convertToObservable();

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

    protected convertToObservable() {
        if (! this._observable) {
            makeObservable(this);
            this._observable = true;
        }
    }
}
