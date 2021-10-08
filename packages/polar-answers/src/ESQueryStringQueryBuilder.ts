/**
 * Builds a query string query from the given term array.
 */
export namespace ESQueryStringQueryBuilder {

    function build(terms: ReadonlyArray<string>, sep: string): string {

        if (terms.length === 0) {
            return ""
        }

        return terms.map(term => `(${term})`)
            .join(sep);

    }


    export function buildAND(terms: ReadonlyArray<string>): string {
        return build(terms, " AND ");
    }

    export function buildOR(terms: ReadonlyArray<string>): string {
        return build(terms, " OR ");
    }

}
