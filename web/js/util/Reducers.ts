export class Reducers {

    public static SUM =
       (accumulator: number, currentValue: number) => accumulator + currentValue

    /**
     * Return the first entry in the reducer.  A default value to reduce can be
     * specified as the initial value and it will work with a list of zero or more
     * entries and provide the default when no list entries are available.
     */
    public static FIRST =
        <T> (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => {

            if (currentIndex === 0) {
                return currentValue;
            } else {
                return previousValue;
            }

        }

    public static LAST =
        <T> (previousValue: T, currentValue: T) => currentValue

}
