"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRepoFilters2 = void 0;
const Strings_1 = require("polar-shared/src/util/Strings");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const RepoDocAnnotations_1 = require("../RepoDocAnnotations");
const TagMatcher2_1 = require("../../../../web/js/tags/TagMatcher2");
var AnnotationRepoFilters2;
(function (AnnotationRepoFilters2) {
    function execute(docAnnotations, filter) {
        docAnnotations = doFilterValid(docAnnotations, filter);
        docAnnotations = doFilterByText(docAnnotations, filter);
        docAnnotations = doFilterByTags(docAnnotations, filter);
        docAnnotations = doFilterByColor(docAnnotations, filter);
        docAnnotations = doFilterByAnnotationTypes(docAnnotations, filter);
        return docAnnotations;
    }
    AnnotationRepoFilters2.execute = execute;
    function doFilterByColor(docAnnotations, filter) {
        const { colors } = filter;
        if (colors && colors.length > 0) {
            return docAnnotations.filter(current => {
                const color = HighlightColor_1.HighlightColors.withDefaultColor(current.color);
                return colors.includes(color);
            });
        }
        return docAnnotations;
    }
    function doFilterByAnnotationTypes(docAnnotations, filter) {
        const { annotationTypes } = filter;
        if (annotationTypes && annotationTypes.length > 0) {
            return docAnnotations.filter(current => annotationTypes.includes(current.annotationType));
        }
        return docAnnotations;
    }
    function doFilterValid(docAnnotations, filter) {
        return docAnnotations.filter(current => RepoDocAnnotations_1.RepoDocAnnotations.isValid(current));
    }
    function doFilterByText(docAnnotations, filter) {
        if (!Strings_1.Strings.empty(filter.text)) {
            return docAnnotations
                .filter(current => Preconditions_1.isPresent(current.text))
                .filter(current => current.text.toLowerCase().indexOf(filter.text.toLowerCase()) >= 0);
        }
        return docAnnotations;
    }
    function doFilterFlagged(docAnnotations, filter) {
        if (filter.flagged) {
            return docAnnotations.filter(current => { var _a; return (_a = current.docInfo) === null || _a === void 0 ? void 0 : _a.flagged; });
        }
        return docAnnotations;
    }
    function doFilterArchived(docAnnotations, filter) {
        if (!filter.archived) {
            return docAnnotations.filter(current => { var _a; return !((_a = current.docInfo) === null || _a === void 0 ? void 0 : _a.archived); });
        }
        return docAnnotations;
    }
    function doFilterByTags(docAnnotations, filter) {
        if (!filter.tags) {
            return docAnnotations;
        }
        const tags = filter.tags.filter(current => current.id !== '/');
        if (tags.length === 0) {
            return docAnnotations;
        }
        return TagMatcher2_1.TagMatcher2.filter(docAnnotations, tags);
    }
})(AnnotationRepoFilters2 = exports.AnnotationRepoFilters2 || (exports.AnnotationRepoFilters2 = {}));
//# sourceMappingURL=AnnotationRepoFilters2.js.map