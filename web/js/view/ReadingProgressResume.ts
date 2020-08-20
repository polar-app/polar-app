import {Elements} from '../util/Elements';
import {Rects} from '../Rects';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

export namespace ReadingProgressResume {

    export interface ResumeOpts {
        readonly docMeta: IDocMeta;
    }

    export function resume(opts: ResumeOpts): boolean {
        // setTimeout(() => doResume(opts), 1);
        return doResume(opts);
    }

    function doResume(opts: ResumeOpts): boolean {

        const {docMeta} = opts;

        const targetPagemark = computeTargetPagemark(docMeta);

        if (! targetPagemark) {
            return false;
        }

        scrollToPagemark(targetPagemark);

        return true;

    }

    function scrollToPagemark(targetPagemark: PagemarkHolder) {

        // FIXME: this has to be rewritten as a hook so that we can jump to the
        // page properly and that the toolbar has the right page.

        // FIXME: the 'next' button doesn't work when we jump to a page after load
        // as I think the current page number isn't changed.

        const pages = document.querySelectorAll(".page");

        const pageNum = targetPagemark.pageNum;

        const pageElement = <HTMLElement> pages[pageNum - 1];

        const scrollParent = getScrollParent(pageElement);

        if (! pageElement) {
            return;
        }

        const pageOffset = Elements.getRelativeOffsetRect(pageElement, scrollParent);

        const pageTop = pageOffset.top;
        const pageHeight = Math.floor(pageElement.clientHeight);

        // now compute the height of the pagemark so that we scroll to that
        // point.
        const pagemarkHeight = computePagemarkHeight(targetPagemark, pageHeight);

        // but adjust it a bit so that the bottom portion of the pagemark is
        // visible by computing the height of the window and shifting it
        const windowDelta = window.innerHeight * (0.2);

        const newScrollTop = Math.floor(pageTop + pagemarkHeight - windowDelta);

        scrollParent.scrollTop = newScrollTop;

    }

    function computePagemarkHeight(targetPagemark: PagemarkHolder,
                                   pageHeight: number): number {

            const pagemarkBottom
                = Math.floor(Rects.createFromBasicRect(targetPagemark.pagemark.rect).bottom);

            const pagemarkBottomPerc = pagemarkBottom / 100;

            return pageHeight * pagemarkBottomPerc;


        // if (opts.fileType === 'pdf') {
        //
        //     const pagemarkBottom
        //         = Math.floor(Rects.createFromBasicRect(targetPagemark.pagemark.rect).bottom);
        //
        //     const pagemarkBottomPerc = pagemarkBottom / 100;
        //
        //     return pageHeight * pagemarkBottomPerc;
        //
        // } else {
        //
        //     // TODO: should be sorted by time and not by position.
        //     const pagemarkElements
        //         = Array.from(pageElement.querySelectorAll(".pagemark"))
        //                .sort((a, b) => a.getBoundingClientRect().bottom - b.getBoundingClientRect().bottom);
        //
        //     const pagemarkElement = Arrays.last(pagemarkElements);
        //
        //     if (pagemarkElement) {
        //
        //         // in HTML mode or PDFs with smaller
        //
        //         return pagemarkElement.clientHeight;
        //
        //     } else {
        //         throw new Error("No pagemarkElement");
        //     }
        //
        // }

    };

    function getScrollParent(element: HTMLElement) {

        // FIXME not portable /compatible with react
        return <HTMLElement> document.querySelector("#viewerContainer");

        // if (fileType === 'pdf') {
        //     return <HTMLElement> document.querySelector("#viewerContainer");
        // }
        //
        // return  <HTMLElement> Elements.getScrollParent(element);

    }

    function computePagemarks(docMeta: IDocMeta): ReadonlyArray<PagemarkHolder> {

        const result: PagemarkHolder[] = [];

        // TODO: this would be better with arrayStream now...
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

    function computeTargetPagemark(docMeta: IDocMeta): PagemarkHolder | undefined {

        const pagemarkHolders = computePagemarks(docMeta);

        let result: PagemarkHolder | undefined;

        /**
         * Compare two pagemarks and return the one that is farthest down the
         * page.
         */
        const comparePagemarks = (p0: PagemarkHolder | undefined, p1: PagemarkHolder) => {

            if (!p0) {
                return p1;
            }

            if (p0.pageNum < p1.pageNum) {
                return p1;
            }

            if (p0.pageNum === p1.pageNum) {

                // TODO: should be by time and not by position.

                if (Rects.createFromBasicRect(p0.pagemark.rect).bottom <
                    Rects.createFromBasicRect(p1.pagemark.rect).bottom) {

                    return p1;

                }

            }

            return p0;

        };

        // TODO: this could be cleaner via a sort + reduce/last
        for (const pagemarkHolder of pagemarkHolders) {
            result = comparePagemarks(result, pagemarkHolder);
        }

        return result;

    }

}

interface PagemarkHolder {
    readonly pageNum: number;
    readonly pagemark: IPagemark;
}

