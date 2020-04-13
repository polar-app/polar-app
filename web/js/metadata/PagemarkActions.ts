import {DocMetas} from "./DocMetas";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Logger} from "polar-shared/src/logger/Logger";
import {TriggerEvent} from "../contextmenu/TriggerEvent";

const log = Logger.create();

export namespace PagemarkActions {

    export async function contextMenuCreatePagemarkToPoint(triggerEvent: TriggerEvent) {

        try {

            const pageElement = this.docFormat.getPageElementFromPageNum(triggerEvent.pageNum);
            const pageNum = triggerEvent.pageNum;
            const verticalOffsetWithinPageElement = triggerEvent.points.pageOffset.y;

            createPagemarkAtPoint(pageNum, pageElement, verticalOffsetWithinPageElement)
                .catch(err => log.error("Failed to create pagemark: ", err));

        } finally {
            // Analytics.event({category: 'user', action: 'created-pagemark-via-context-menu'});
        }

    }

    export async function createPagemarkAtPoint(pageNum: number,
                                                pageElement: HTMLElement,
                                                verticalOffsetWithinPageElement: number) {

        const pageHeight = pageElement.clientHeight;

        const percentage = Percentages.calculate(verticalOffsetWithinPageElement, pageHeight, {noRound: true});

        log.info("percentage for pagemark: ", percentage);

        const docMeta = this.model.docMeta;

        await DocMetas.withBatchedMutations(docMeta, async () => {
            // TODO: do not use the model here and instead move this to the Pagemarks code which
            // we can test better...
            this.model.erasePagemark(pageNum);
            await this.model.createPagemarksForRange(pageNum, percentage);
        });

    }

}
