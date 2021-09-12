/**
 * Implements batch auto-commit and the user can sync() when complete to verify
 * all data has been updated.
 */
export namespace Batcher {

    export interface IBatcher<T> {

        /**
         * Write a record, optionally performing auto-commit.
         */
        readonly write: (record: T) => Promise<void>;

        /**
         * Write the records with the delegate and flush the buffer.
         */
        readonly sync: () => Promise<void>;

    }

    export function create<T>(delegate: (records: ReadonlyArray<T>) => Promise<void>,
                              interval = 50): IBatcher<T> {

        let buff: T[] = []

        async function write(record: T) {

            if (buff.length >= interval) {
                await sync();
            } else {
                buff.push(record);
            }

        }

        async function sync() {
            await delegate(buff);
            buff = [];
        }

        return {write, sync};

    }

}
