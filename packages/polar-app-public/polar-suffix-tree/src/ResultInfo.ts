/**
 * An utility object, used to store the data returned by the GeneralizedSuffixTree GeneralizedSuffixTree.searchWithCount method.
 * It contains a collection of results and the total number of results present in the GST.
 * @see GeneralizedSuffixTree#searchWithCount(java.lang.String, int)
 */
export class ResultInfo {

    constructor(public readonly results: ReadonlyArray<number>,
                public readonly totalResults: number) {

    }

}
