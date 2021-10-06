/**
 * Builds a query string query from the given term array.
 */
export namespace ESQueryStringQueryBuilder {

    export function build(terms: ReadonlyArray<string>): string {

        if (terms.length === 0) {
            return ""
        }

        return terms.map(term => `(${term})`)
                    .join(" AND ");

    }

}
