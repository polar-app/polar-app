import {BrowserWindow} from 'electron';
import {Sets} from '../../util/Sets';
import {Objects} from '../../util/Objects';
import {Dictionaries} from '../../util/Dictionaries';


export class BrowserWindowMeta {

    /**
     * Set of tags associated with this window.
     */
    tags: {[name: string] : string} = {}

}

/**
 * Get a list of IDs for live windows.
 */
export interface LiveWindowsProvider {

    getLiveWindowIDs(): ID[];

}

export class DefaultLiveWindowsProvider implements LiveWindowsProvider {

    getLiveWindowIDs(): ID[] {
        return BrowserWindow.getAllWindows().map(current => current.id);
    }

}

/**
 * the ID if ao
 */
export type ID = number;

/**
 * Maintains a registry of BrowserWindows (by ID) and metadata.  GC is performed
 * each time you access the metadata since windows can come and go.
 */
export class BrowserWindowRegistry {

    // note that internally Typescript maps the numbers to strings but this
    // really breaks the APIs for dealing with Keys so we're just going to
    // give up and use a string for now.
    private static registry: {[id: string]: BrowserWindowMeta} = {};

    private static liveWindowsProvider: LiveWindowsProvider = new DefaultLiveWindowsProvider();

    /**
     * Get the metadata for a specific BrowserWindow by id.  You can access this
     * by BrowserWindow.id
     *
     * @param id
     */
    public static get(id: ID): BrowserWindowMeta | undefined {
        this.gc();
        return this.registry[`${id}`];
    }

    public static tag(id: ID, tags: {[name: string] : string}) {
        this.gc();

        if(! (id in this.registry)) {
            this.registry[`${id}`] = new BrowserWindowMeta();
        }

        let meta = this.registry[`${id}`];

        Dictionaries.forDict(tags, (name, value) => {
            meta.tags[name] = value;
        })

    }

    /**
     * Find a window ID with the given tag.
     */
    public static tagged(tag: BrowserWindowTag): ID[] {
        this.gc();

        let result: ID[] = [];

        Dictionaries.forDict(this.registry, (id, meta) => {

            if(meta.tags[tag.name] === tag.value) {
                result.push(parseInt(id));
            }

        });

        return result;

    }

    public static gc() {

        let registryKeys = Object.keys(this.registry);
        let liveWindowIDs
            = this.liveWindowsProvider.getLiveWindowIDs().map(current => current.toString())

        let allWindowIDs = Sets.union(registryKeys, liveWindowIDs);

        let keysToRemove = Sets.difference(allWindowIDs, liveWindowIDs);

        keysToRemove.forEach(current => delete this.registry[current]);

        return keysToRemove.map(current => parseInt(current));

    }

}

export interface BrowserWindowTag {
    name: string;
    value: string;
}
