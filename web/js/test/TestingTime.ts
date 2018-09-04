
import timekeeper from 'timekeeper';

const time = new Date(1330688329321);

export class TestingTime {

    /**
     * Freeze time for testing...
     */
    static freeze() {

        timekeeper.freeze(time);
    }

    static forward(durationMS: number) {
        timekeeper.freeze(new Date(Date.now() + durationMS));
    }

}

export function freeze() {
    TestingTime.freeze();
}
