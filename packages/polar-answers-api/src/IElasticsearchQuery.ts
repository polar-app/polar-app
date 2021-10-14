export interface IElasticsearchQueryStringQueryFields {
    readonly query: string;
    // eslint-disable-next-line camelcase
    readonly default_field: string;
}

export interface IElasticsearchQueryStringQuery {
    // eslint-disable-next-line camelcase
    readonly query_string: IElasticsearchQueryStringQueryFields;
}

export type IElasticsearchSort = ["_score"] | ["idx"];

export interface IElasticsearchQuery {
    readonly query: IElasticsearchQueryStringQuery;
    readonly size: number;
    readonly sort: IElasticsearchSort;
}

export interface IElasticsearchDeleteByQuery {
    readonly query: IElasticsearchQueryStringQuery;
}
