import {Arrays} from '../util/Arrays';
import {Elements} from '../util/Elements';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {DocMeta} from '../metadata/DocMeta';
import {Pagemark} from '../metadata/Pagemark';
import {Rects} from '../Rects';
import {sort} from 'semver';
import {Reducers} from '../util/Reducers';

export class ReadingProgressResume {

    public static resume(docMeta: DocMeta) {

        if (this.scrollToPage(docMeta)) {

            // this.scrollToLastPagemark();

        }

    }

    private static scrollToPage(docMeta: DocMeta): boolean {

        const targetPagemark = this.computeTargetPagemark(docMeta);

        if (! targetPagemark) {
            return false;
        }

        const pages = document.querySelectorAll(".page");

        const pageNum = targetPagemark.pageNum;

        const pageElement = <HTMLElement> pages[pageNum - 1];

        const scrollParent = this.getScrollParent(pageElement);

        const pageOffset = Elements.getRelativeOffsetRect(pageElement, scrollParent);

        const pageTop = pageOffset.top;
        const pageHeight = Math.floor(pageElement.clientHeight);

        const computePagemarkHeight = (): number => {

            const docFormat = DocFormatFactory.getInstance();

            if (docFormat.name === 'pdf') {

                const pagemarkBottom
                    = Math.floor(Rects.createFromBasicRect(targetPagemark.pagemark.rect).bottom);

                const pagemarkBottomPerc = pagemarkBottom / 100;

                return pageHeight * pagemarkBottomPerc;

            } else {

                const pagemarkElements
                    = Array.from(pageElement.querySelectorAll(".pagemark"));

                const pagemarkElement =
                    pagemarkElements.sort((a, b) => a.getBoundingClientRect().bottom - b.getBoundingClientRect().bottom)
                        .reduce(Reducers.LAST);

                if (pagemarkElement) {

                    // in HTML mode or PDFs with smaller

                    return pagemarkElement.clientHeight;

                } else {
                    throw new Error("No pagemarkElement");
                }

            }

        };

        // now compute the height of the pagemark so that we scroll to that
        // point.
        const pagemarkHeight = computePagemarkHeight();

        // but adjust it a bit so that the bottom portion of the pagemark is
        // visible
        const windowDelta = window.innerHeight * (0.2);

        scrollParent.scrollTop = pageOffset.top + pagemarkHeight - windowDelta;

        // scrollParent.scrollTop = pageTop + pagemarkHeight;
        // scrollParent.scrollTop = pageOffset.top + pagemarkHeight;

        // scrollParent.scrollTop = pageOffset.top ;

        // FIXME: some if these values are wrong for pagemarks... try to find
        // out why...


        // FIXME: record the ideal values..

        // FIXME: teh pagemark is too tall.. it should be a function of the
        // client Height but it.s not... .. for HTML mode resort to getting the
        // raw pagemark clientHeight.



        // scrollParent.scrollTop = pageOffset.top + (pageHeight * 0.55);
        console.log(`FIXME: windowDelta: ${windowDelta}`);

        console.log(`FIXME: state: `, JSON.stringify({
            pageNum,
            pageTop,
            pageHeight,
            windowDelta,
            pagemarkHeight
        }, null, "  "));

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

            const scrollParent = this.getScrollParent(last);

            if (scrollParent) {

                const scrollDelta = window.innerHeight * (2 / 3);
                const scrollTop = scrollParent.scrollTop;

                const newScrollTop = scrollTop + scrollDelta;

                scrollParent.scrollTop = newScrollTop;

            }

        }

    }

    private static getScrollParent(element: HTMLElement) {

        const docFormat = DocFormatFactory.getInstance();

        if (docFormat.name === 'pdf') {
            return <HTMLElement> document.querySelector("#viewerContainer");
        }

        return  <HTMLElement> Elements.getScrollParent(element);

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

                // FIXME this should be based on TIME and nto position.  This
                // way the user can jump around properly

                if (Rects.createFromBasicRect(p0.pagemark.rect).bottom <
                    Rects.createFromBasicRect(p1.pagemark.rect).bottom) {

                    return p1;

                }

            }

            return p0;

        };

        for (const pagemarkHolder of pagemarkHolders) {

            result = comparePagemarks(result, pagemarkHolder);

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

