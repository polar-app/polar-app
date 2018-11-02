
import timekeeper from 'timekeeper';

const time = new Date(1330688329321);

export class TestingTime {

    /**
     * Freeze time for testing at '2012-03-02T11:38:49.321Z'
     */
    public static freeze() {
        timekeeper.freeze(time);
    }

    public static forward(durationMS: number) {
        timekeeper.freeze(new Date(Date.now() + durationMS));
    }

}

export function freeze() {
    TestingTime.freeze();
}
