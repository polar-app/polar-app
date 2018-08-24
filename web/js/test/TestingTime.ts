
const tk = require('timekeeper');
const time = new Date(1330688329321);

export class TestingTime {

    static freeze() {

        // freeze time for testing...
        tk.freeze(time);
    }

}

export function freeze() {
    TestingTime.freeze();
}
