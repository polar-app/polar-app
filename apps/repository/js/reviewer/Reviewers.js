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
exports.Reviewers = exports.DEFAULT_LIMIT = void 0;
const ReviewerTasks_1 = require("./ReviewerTasks");
const Functions_1 = require("polar-shared/src/util/Functions");
const SpacedReps_1 = require("polar-firebase/src/firebase/om/SpacedReps");
const S2Plus_1 = require("polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus");
const TasksCalculator_1 = require("polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const SpacedRepStats_1 = require("polar-firebase/src/firebase/om/SpacedRepStats");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Analytics_1 = require("../../../../web/js/analytics/Analytics");
const log = Logger_1.Logger.create();
exports.DEFAULT_LIMIT = 10;
var Reviewers;
(function (Reviewers) {
    function create(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { annotations, mode, firestore } = opts;
            const limit = opts.limit || exports.DEFAULT_LIMIT;
            const onClose = opts.onClose || Functions_1.NULL_FUNCTION;
            Preconditions_1.Preconditions.assertPresent(mode, 'mode');
            const uid = firestore.uid;
            if (!uid) {
                throw new Error("Not logged in");
            }
            const calculateTaskReps = () => __awaiter(this, void 0, void 0, function* () {
                switch (mode) {
                    case "flashcard":
                        return yield ReviewerTasks_1.ReviewerTasks.createFlashcardTasks(annotations, limit);
                    case "reading":
                        return yield ReviewerTasks_1.ReviewerTasks.createReadingTasks(annotations, limit);
                }
            });
            const calculatedTaskReps = yield calculateTaskReps();
            const { taskReps } = calculatedTaskReps;
            const doWriteQueueStageCounts = () => __awaiter(this, void 0, void 0, function* () {
                const spacedRepStats = Object.assign({ created: ISODateTimeStrings_1.ISODateTimeStrings.create(), type: 'queue', mode }, calculatedTaskReps.stageCounts);
                yield SpacedRepStats_1.SpacedRepStats.write(uid, spacedRepStats);
            });
            yield doWriteQueueStageCounts();
            console.log("Found N tasks: " + taskReps.length);
            const completedStageCounts = S2Plus_1.StageCountsCalculator.createMutable();
            const incrCompletedStageCounts = (taskRep) => {
                switch (taskRep.stage) {
                    case "new":
                        ++completedStageCounts.nrNew;
                        break;
                    case "learning":
                        ++completedStageCounts.nrLearning;
                        break;
                    case "review":
                        ++completedStageCounts.nrReview;
                        break;
                    case "lapsed":
                        ++completedStageCounts.nrLapsed;
                        break;
                }
            };
            const doWriteCompletedStageCounts = () => __awaiter(this, void 0, void 0, function* () {
                const spacedRepStats = Object.assign({ created: ISODateTimeStrings_1.ISODateTimeStrings.create(), type: 'completed', mode }, completedStageCounts);
                yield SpacedRepStats_1.SpacedRepStats.write(uid, spacedRepStats);
                console.log("Wrote completed state counts");
            });
            const doWriteSuspendedCounts = (taskRep) => __awaiter(this, void 0, void 0, function* () {
                const convertedSpacedRep = SpacedReps_1.SpacedReps.convertFromTaskRep(uid, taskRep);
                const spacedRep = Object.assign(Object.assign({}, convertedSpacedRep), { suspended: true });
                yield SpacedReps_1.SpacedReps.set(taskRep.id, spacedRep);
            });
            const doFinished = () => __awaiter(this, void 0, void 0, function* () {
                console.log("Got finished...");
                doWriteCompletedStageCounts()
                    .catch(err => log.error("Unable to write completed stage counts: ", err));
                onClose();
            });
            const doSuspended = (taskRep) => __awaiter(this, void 0, void 0, function* () {
                yield doWriteSuspendedCounts(taskRep);
            });
            const doRating = (taskRep, rating) => __awaiter(this, void 0, void 0, function* () {
                console.log("Saving rating... ");
                const next = TasksCalculator_1.TasksCalculator.computeNextSpacedRep(taskRep, rating);
                const spacedRep = Dictionaries_1.Dictionaries.onlyDefinedProperties(Object.assign({ uid }, next));
                incrCompletedStageCounts(taskRep);
                yield SpacedReps_1.SpacedReps.set(next.id, spacedRep);
            });
            Analytics_1.Analytics.event({ category: 'reviewer', action: 'created-' + mode });
            return {
                taskReps,
                doRating,
                doSuspended,
                doFinished
            };
        });
    }
    Reviewers.create = create;
})(Reviewers = exports.Reviewers || (exports.Reviewers = {}));
//# sourceMappingURL=Reviewers.js.map