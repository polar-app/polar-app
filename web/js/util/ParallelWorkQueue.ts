import {Latch} from './Latch';

export class ParallelWorkQueue<T, V> {

    private readonly work: T[];

    private readonly handler: (input: T) => Promise<V>;

    private readonly completion: Latch<boolean> = new Latch();

    private completed: boolean = false;

    constructor(work: T[], handler: (input: T) => Promise<V>) {
        this.work = work;
        this.handler = handler;
    }

    public execute(concurrency: number = 25) {

        for (let i = 0; i < concurrency; i++) {
            this.handleWork();
        }

        return this.completion;

    }

    private handleWork() {

        if (this.work.length === 0) {

            if (!this.completed) {
                this.completion.resolve(true);
                this.completed = true;
            }

            return;

        }

        const task = this.work.pop()!;

        this.handler(task)
            .then(() => {
                this.handleWork();
            })
            .catch(err => {
                // your code should do its own error handling....
                this.handleWork();
            });

    }

}
