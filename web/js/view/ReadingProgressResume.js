"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingProgressResume = void 0;
const React = __importStar(require("react"));
const Rects_1 = require("../Rects");
const DocViewerStore_1 = require("../../../apps/doc/src/DocViewerStore");
const JumpToAnnotationHook_1 = require("../annotation_sidebar/JumpToAnnotationHook");
var ReadingProgressResume;
(function (ReadingProgressResume) {
    function useReadingProgressResume() {
        const { docMeta } = DocViewerStore_1.useDocViewerStore(['docMeta']);
        const jumpToAnnotationHandler = JumpToAnnotationHook_1.useJumpToAnnotationHandler();
        const targetPagemark = computeTargetPagemark(docMeta);
        const active = targetPagemark !== undefined;
        const handler = React.useCallback(() => {
            if (!docMeta) {
                console.warn("Progress can not resume (no docMeta)");
                return;
            }
            if (!targetPagemark) {
                console.warn("Progress can not resume (no targetPagemark)");
                return;
            }
            jumpToAnnotationHandler({
                target: targetPagemark.pagemark.id,
                pageNum: targetPagemark.pageNum,
                docID: docMeta.docInfo.fingerprint,
                pos: 'bottom'
            });
        }, [docMeta, jumpToAnnotationHandler, targetPagemark]);
        return [active, handler];
    }
    ReadingProgressResume.useReadingProgressResume = useReadingProgressResume;
    function computePagemarks(docMeta) {
        const result = [];
        for (const pageMeta of Object.values(docMeta.pageMetas)) {
            const pagemarks = Object.values(pageMeta.pagemarks || {});
            const pagemarkHolders = pagemarks.map(pagemark => {
                return {
                    pageNum: pageMeta.pageInfo.num,
                    pagemark
                };
            });
            result.push(...pagemarkHolders);
        }
        return result;
    }
    function computeTargetPagemark(docMeta) {
        if (!docMeta) {
            return undefined;
        }
        const pagemarkHolders = computePagemarks(docMeta);
        let result;
        const comparePagemarks = (p0, p1) => {
            if (!p0) {
                return p1;
            }
            if (p0.pageNum < p1.pageNum) {
                return p1;
            }
            if (p0.pageNum === p1.pageNum) {
                if (Rects_1.Rects.createFromBasicRect(p0.pagemark.rect).bottom <
                    Rects_1.Rects.createFromBasicRect(p1.pagemark.rect).bottom) {
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
})(ReadingProgressResume = exports.ReadingProgressResume || (exports.ReadingProgressResume = {}));
//# sourceMappingURL=ReadingProgressResume.js.map