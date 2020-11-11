"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewerTasks = void 0;
const TasksCalculator_1 = require("polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator");
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const SpacedReps_1 = require("polar-firebase/src/firebase/om/SpacedReps");
const IDMaps_1 = require("polar-shared/src/util/IDMaps");
const Firebase_1 = require("../../../../web/js/firebase/Firebase");
const FlashcardTaskActions_1 = require("./cards/FlashcardTaskActions");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Reducers_1 = require("polar-shared/src/util/Reducers");
const SpacedRepStats_1 = require("polar-firebase/src/firebase/om/SpacedRepStats");
const FirestoreCollections_1 = require("./FirestoreCollections");
const Strings_1 = require("polar-shared/src/util/Strings");
class ReviewerTasks {
    static createReadingTasks(repoDocAnnotations, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const mode = 'reading';
            const taskBuilder = (repoDocAnnotations) => {
                const toTask = (docAnnotation) => {
                    const color = HighlightColor_1.HighlightColors.withDefaultColor(docAnnotation.color);
                    return {
                        id: docAnnotation.guid || docAnnotation.id,
                        action: {
                            docAnnotation
                        },
                        created: docAnnotation.created,
                        color,
                        mode
                    };
                };
                const predicate = (annotation) => {
                    if (annotation.annotationType === AnnotationType_1.AnnotationType.AREA_HIGHLIGHT) {
                        return annotation.img !== undefined;
                    }
                    if (annotation.annotationType === AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT) {
                        return !Strings_1.Strings.empty(annotation.text);
                    }
                    return false;
                };
                return repoDocAnnotations
                    .filter(current => predicate(current))
                    .map(toTask);
            };
            return this.createTasks(repoDocAnnotations, mode, taskBuilder, limit);
        });
    }
    static createFlashcardTasks(repoDocAnnotations, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const mode = 'flashcard';
            const taskBuilder = (repoDocAnnotations) => {
                const toTasks = (docAnnotation) => {
                    const toTask = (action) => {
                        return {
                            id: docAnnotation.guid || docAnnotation.id,
                            action,
                            created: docAnnotation.created,
                            mode
                        };
                    };
                    const actions = FlashcardTaskActions_1.FlashcardTaskActions.create(docAnnotation.original, docAnnotation);
                    return actions.map(toTask);
                };
                if (repoDocAnnotations.length === 0) {
                    return [];
                }
                return repoDocAnnotations
                    .filter(current => current.annotationType === AnnotationType_1.AnnotationType.FLASHCARD)
                    .map(toTasks)
                    .reduce(Reducers_1.Reducers.FLAT, []);
            };
            return this.createTasks(repoDocAnnotations, mode, taskBuilder, limit);
        });
    }
    static createTasks(repoDocAnnotations, mode, tasksBuilder, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(mode, 'mode');
            const potential = tasksBuilder(repoDocAnnotations);
            const uid = yield Firebase_1.Firebase.currentUserID();
            if (!uid) {
                throw new Error("Not authenticated");
            }
            const spacedReps = yield SpacedReps_1.SpacedReps.list(uid);
            const spacedRepsMap = IDMaps_1.IDMaps.create(spacedReps);
            const optionalTaskRepResolver = (task) => __awaiter(this, void 0, void 0, function* () {
                const spacedRep = spacedRepsMap[task.id];
                if (!spacedRep) {
                    return undefined;
                }
                const age = TasksCalculator_1.TasksCalculator.computeAge(spacedRep);
                return Object.assign(Object.assign(Object.assign({}, task), spacedRep), { age });
            });
            const resolver = TasksCalculator_1.createDefaultTaskRepResolver(optionalTaskRepResolver);
            return yield TasksCalculator_1.TasksCalculator.calculate({
                potential,
                resolver,
                limit
            });
        });
    }
    static isReviewer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield FirestoreCollections_1.FirestoreCollections.configure();
            const uid = yield Firebase_1.Firebase.currentUserID();
            if (!uid) {
                return false;
            }
            return yield SpacedRepStats_1.SpacedRepStats.hasStats(uid);
        });
    }
}
exports.ReviewerTasks = ReviewerTasks;
//# sourceMappingURL=ReviewerTasks.js.map