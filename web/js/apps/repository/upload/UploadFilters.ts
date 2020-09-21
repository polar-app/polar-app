export namespace UploadFilters {

    /**
     * A value with a type which is a mime type.  Example: 'text/html'
     */
    interface IType {
        readonly type: string | undefined;
    }

    /**
     * Filter this down to just the accepted document types
     */
    export function filterByDocumentType<V extends IType>(value: V) {
        const types = ['application/pdf', 'application/epub+zip'];
        return value.type !== undefined &&
               types.includes(value.type.toLowerCase());
    }

}
