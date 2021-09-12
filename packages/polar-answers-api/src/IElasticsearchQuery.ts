export interface IElasticsearchQueryStringQueryFields {
    readonly query: string;
    // eslint-disable-next-line camelcase
    readonly default_field: string;
}

export interface IElasticsearchQueryStringQuery {
    readonly query_string: IElasticsearchQueryStringQueryFields;
}


export interface IElasticsearchQuery {
    readonly query: IElasticsearchQueryStringQuery;
    readonly size: number;
}
