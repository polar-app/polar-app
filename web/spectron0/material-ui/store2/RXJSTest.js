"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
describe('RXJS', function () {
    it("basic", function () {
        const subject = new rxjs_1.Subject();
        const subscription0 = subject.subscribe(value => {
            console.log("FIXME1: got value: " + value);
        });
        const subscription1 = subject.subscribe(value => {
            console.log("FIXME2: got value: " + value);
        });
        subject.next(1);
        subject.next(2);
        subscription0.unsubscribe();
        subscription1.unsubscribe();
    });
    it("initial value", function () {
        const subject = new rxjs_1.Subject();
        subject.next(101);
        const subscription0 = subject.subscribe(value => {
            console.log("FIXME1: got value: " + value);
        });
        subscription0.unsubscribe();
    });
});
//# sourceMappingURL=RXJSTest.js.map