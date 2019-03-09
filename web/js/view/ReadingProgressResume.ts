import {Arrays} from '../util/Arrays';
import {Elements} from '../util/Elements';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {DocMeta} from '../metadata/DocMeta';
import {Pagemark} from '../metadata/Pagemark';

export class ReadingProgressResume {

    public static resume(docMeta: DocMeta) {

        if (this.scrollToPage(docMeta)) {

            this.scrollToLastPagemark();

        }

    }

    private static scrollToPage(docMeta: DocMeta): boolean {

        const targetPagemark = this.computeTargetPagemark(docMeta);

        if (! targetPagemark) {
            return false;
        }

        const pages = document.querySelectorAll(".page");

        const page = pages[targetPagemark.pageNum - 1];

        page.scrollIntoView();

        return true;

    }

    private static scrollToLastPagemark() {

        const docFormat = DocFormatFactory.getInstance();

        if (docFormat.name === 'pdf') {
            // TODO: right now we can't scroll to the last pagemark in pdf mocde
            return;
        }

        const pagemarks = Array.from(document.querySelectorAll(".page .pagemark"));
        const last = <HTMLElement> Arrays.last(pagemarks);

        if (last) {

            last.scrollIntoView({block: 'end'});

            const scrollParent = <HTMLElement> Elements.getScrollParent(last); // html
                                                                             // mode

            // TODO: re-enable this until we can figure out how we can await scrolling.
            // if (docFormat.name === 'pdf') {
            //     scrollParent = <HTMLElement> document.querySelector("#viewerContainer");
            // }

            if (scrollParent) {

                const scrollDelta = window.innerHeight * (2 / 3);
                const scrollTop = scrollParent.scrollTop;

                const newScrollTop = scrollTop + scrollDelta;

                scrollParent.scrollTop = newScrollTop;

            }

        }

    }

    private static computePagemarks(docMeta: DocMeta) {

        const result: PagemarkHolder[] = [];

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const pagemarks = Object.values(pageMeta.pagemarks || {});

            const pagemarkHolders =
                pagemarks.map( pagemark => {
                    return {
                        pageNum: pageMeta.pageInfo.num,
                        pagemark
                    };
                });

            result.push(...pagemarkHolders);

        }

        return result;

    }

    private static computeTargetPagemark(docMeta: DocMeta): PagemarkHolder | undefined {

        const pagemarkHolders = this.computePagemarks(docMeta);

        let result: PagemarkHolder | undefined;

        for (const pagemarkHolder of pagemarkHolders) {

            // TODO: we don't really care about which pagemark just as long as
            // its the max page.
            if (! result || pagemarkHolder.pageNum > result.pageNum) {
                result = pagemarkHolder;
            }

        }

        return result;

    }

}

interface TargetPagemark {
    readonly pageNum: number;
}

interface PagemarkHolder {
    readonly pageNum: number;
    readonly pagemark: Pagemark;
}
