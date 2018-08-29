/**
 * Purge old log files.
 */
export class LogPurger {

    private readonly epoch: Date;

    /**
     * The epoch date before which we should have no log files.
     */
    constructor(epoch: Date) {
        this.epoch = epoch;
    }

    /**
     * Purge old
     * @param paths
     */
    // public static async purge(paths: string[]): Promise<string[]> {
    //
    // }

    /**
     * Given a set of paths, compute a list of files that we can purge that
     * are no longer needed.
     */
    public static computePurgable(paths: string[]): string[] {

        let result: string[] = [];



        return result;

    }

}

export interface Purged {

}
