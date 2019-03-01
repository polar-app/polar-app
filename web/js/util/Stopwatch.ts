export class Stopwatch {

    public readonly started: number;

    public stopped?: number;

    constructor(started: number) {
        this.started = started;
    }

    public stop() {

        if (this.stopped === undefined) {
            this.stopped = Date.now();
        }

        return new TrackedDuration(this.started, this.stopped!);

    }

}

export class TrackedDuration {

    public readonly started: number;

    public readonly stopped: number;

    public readonly durationMS: number;

    constructor(started: number, stopped: number) {
        this.started = started;
        this.stopped = stopped;
        this.durationMS = stopped - started;
    }

    public toString() {
        return `durationMS: ${this.durationMS}`;
    }

}
