import {DocMetas} from "./DocMetas";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Logger} from "polar-shared/src/logger/Logger";
import {TriggerEvent} from "../contextmenu/TriggerEvent";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Pagemarks} from "./Pagemarks";

const log = Logger.create();

export namespace PagemarkActions {

    export async function contextMenuCreatePagemarkToPoint(docMeta: IDocMeta,
                                                           pageNum: number,
                                                           pageElement: HTMLElement,
                                                           triggerEvent: TriggerEvent) {

        try {

            const verticalOffsetWithinPageElement = triggerEvent.points.pageOffset.y;

            createPagemarkAtPoint(docMeta, pageNum, pageElement, verticalOffsetWithinPageElement)
                .catch(err => log.error("Failed to create pagemark: ", err));

        } finally {
            // Analytics.event({category: 'user', action: 'created-pagemark-via-context-menu'});
        }

    }

    export async function createPagemarkAtPoint(docMeta: IDocMeta,
                                                pageNum: number,
                                                pageElement: HTMLElement,
                                                verticalOffsetWithinPageElement: number) {

        const pageHeight = pageElement.clientHeight;

        const percentage = Percentages.calculate(verticalOffsetWithinPageElement, pageHeight, {noRound: true});

        log.info("percentage for pagemark: ", percentage);

        await DocMetas.withBatchedMutations(docMeta, async () => {
            Pagemarks.deletePagemark(docMeta, pageNum);
            Pagemarks.updatePagemarksForRange(docMeta, pageNum, percentage);
        });

    }

}
