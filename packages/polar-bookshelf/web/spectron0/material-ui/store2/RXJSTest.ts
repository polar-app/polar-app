import {assert} from 'chai';
import {Subject} from "rxjs";

describe('RXJS', function() {

    it("basic", function() {

        const subject = new Subject<number>();

        const subscription0 = subject.subscribe(value => {
            console.log("FIXME1: got value: " + value);
        })

        const subscription1 = subject.subscribe(value => {
            console.log("FIXME2: got value: " + value);
        })

        subject.next(1);
        subject.next(2);

        subscription0.unsubscribe();
        subscription1.unsubscribe();

    });

    it("initial value", function() {

        const subject = new Subject<number>();

        subject.next(101)

        const subscription0 = subject.subscribe(value => {
            console.log("FIXME1: got value: " + value);
        })

        subscription0.unsubscribe();

    });


});
