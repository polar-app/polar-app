import * as React from 'react';
import {Rects} from '../Rects';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {useDocViewerStore} from "../../../apps/doc/src/DocViewerStore";
import {IPagemarkRef} from "polar-shared/src/metadata/IPagemarkRef";
import {useJumpToAnnotationHandler} from "../annotation_sidebar/JumpToAnnotationHook";
import {Callback} from "polar-shared/src/util/Functions";
import {AnnotationPtrs} from "../annotation_sidebar/AnnotationPtrs";

export namespace ReadingProgressResume {

    export interface ResumeOpts {
        readonly docMeta: IDocMeta;
    }

    export function useReadingProgressResume(): [boolean, Callback] {

        const {docMeta} = useDocViewerStore(['docMeta']);
        const jumpToAnnotationHandler = useJumpToAnnotationHandler();

        const targetPagemark = computeTargetPagemark(docMeta);

        const active = targetPagemark !== undefined;

        const handler = React.useCallback(() => {

            if (! docMeta) {
                console.warn("Progress can not resume (no docMeta)");
                return;
            }

            if (! targetPagemark) {
                console.warn("Progress can not resume (no targetPagemark)");
                return;
            }

            const ptr = AnnotationPtrs.create({
                target: targetPagemark.pagemark.id,
                pageNum: targetPagemark.pageNum,
                docID: docMeta.docInfo.fingerprint,
                pos: 'bottom'
            })

            jumpToAnnotationHandler(ptr);

        }, [docMeta, jumpToAnnotationHandler, targetPagemark]);

        return [active, handler];

    }

    function computePagemarks(docMeta: IDocMeta): ReadonlyArray<IPagemarkRef> {

        const result: IPagemarkRef[] = [];

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

    function computeTargetPagemark(docMeta: IDocMeta | undefined): IPagemarkRef | undefined {

        if (! docMeta) {
            return undefined;
        }

        const pagemarkHolders = computePagemarks(docMeta);

        let result: IPagemarkRef | undefined;

        /**
         * Compare two pagemarks and return the one that is farthest down the
         * page.
         */
        const comparePagemarks = (p0: IPagemarkRef | undefined, p1: IPagemarkRef) => {

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
