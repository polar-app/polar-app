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
const Executors_1 = require("./Executors");
const Latch_1 = require("polar-shared/src/util/Latch");
describe('Executors', function () {
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let iter = 0;
            const latch = new Latch_1.Latch();
            const completion = new Latch_1.Latch();
            const onCompletion = () => {
                completion.resolve(true);
            };
            Executors_1.Executors.runPeriodically({ interval: '100ms', maxIterations: 5, onCompletion }, () => {
                ++iter;
                if (iter === 5) {
                    latch.resolve(true);
                }
            });
            yield latch.get();
            yield completion.get();
        });
    });
});
//# sourceMappingURL=ExecutorsTest.js.map