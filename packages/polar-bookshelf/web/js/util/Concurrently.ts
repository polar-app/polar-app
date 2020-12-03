export class Concurrently {

    /**
     * Keep executing the async function in the background until the predicate
     * returns true.  This can be used for testing or where we expect a value
     * to be updated yet have no event notification of when it will actually
     * happen.
     */
    public static waitForPredicate<T>(callable: Callable<T>, predicate: Predicate<T>, intervalMS: number = 250): Promise<T> {

        return new Promise<T>((resolve, reject) => {

            let executor = async () => {

                try {

                    let val = await callable();

                    if(predicate(val)) {

                        resolve(val);
                        return;

                    } else {
                        setTimeout(executor, intervalMS);
                    }


                } catch (e) {
                    reject(e);
                }

            };

            setTimeout(executor, 0);

        });

    }

}

export interface Callable<T> {
    (): Promise<T>;
}

export interface Predicate<T> {
    (val: T): boolean;
}
