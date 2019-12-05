import {RepoDocInfo} from "../RepoDocInfo";
import {RendererAnalytics} from "../../../../web/js/ga/RendererAnalytics";
import {Logger} from "polar-shared/src/logger/Logger";
import {Tag, Tags, TagStr} from "polar-shared/src/tags/Tags";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {Callback} from "polar-shared/src/util/Functions";
import {DatastoreUserTags} from "../../../../web/js/datastore/DatastoreUserTags";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {IDMaps} from "polar-shared/src/util/IDMaps";

const log = Logger.create();

/**
 * Class used to mutate the persistence layer for UI operations like deleting tags, etc.
 */
export class PersistenceLayerMutator {

    public constructor(private readonly repoDocMetaManager: RepoDocMetaManager,
                       private readonly persistenceLayerProvider: PersistenceLayerProvider,
                       private readonly tagsProvider: () => ReadonlyArray<Tag>,
                       private readonly repoDocInfosProvider: () => ReadonlyArray<RepoDocInfo>,
                       private readonly refresher: Callback) {

    }

    public async createTag(newTag: TagStr) {

        const persistenceLayer = this.persistenceLayerProvider();
        const prefs = persistenceLayer.datastore.getPrefs().get().prefs;

        await DatastoreUserTags.create(prefs, newTag);

    }

    public async deleteTag(deleteTag: TagStr) {

        const deleteFromUserTags = async () => {

            const persistenceLayer = this.persistenceLayerProvider();
            const prefs = persistenceLayer.datastore.getPrefs().get().prefs;

            const userTags = DatastoreUserTags.get(prefs);

            const newUserTags = userTags.filter(current => current.id !== deleteTag);

            console.log("FIXME: writing new user tags: ", newUserTags);

            await DatastoreUserTags.set(prefs, newUserTags);

        };

        const lookupTag = (tag: TagStr): Tag | undefined => {

            const tagMap = IDMaps.create(this.tagsProvider());

            return tagMap[tag] || undefined;

        };

        const deleteFromDocInfos = async () => {

            const tag = lookupTag(deleteTag);

            if (tag) {
                const repoDocInfos = this.repoDocInfosProvider();
                this.removeTagsFromDocInfos([tag], repoDocInfos);
            } else {
                log.warn("Unable to find tag: " + deleteTag);
            }

        };

        await deleteFromUserTags();

        await deleteFromDocInfos();

    }

    private async removeTagsFromDocInfos(removeTags: ReadonlyArray<Tag>,
                                         repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const newTags = Tags.difference(existingTags, removeTags);

            if (existingTags.length === newTags.length) {
                // no tags were removed so no need to write new data.
                continue;
            }

            await this.writeDocInfoTags(repoDocInfo, newTags)
                .catch(err => log.error(err));

        }

    }

    private async writeDocInfoTags(repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) {
        RendererAnalytics.event({category: 'user', action: 'doc-tagged'});
        await this.repoDocMetaManager.writeDocInfoTags(repoDocInfo, tags);
        this.refresher();
    }

}
