export class SchemaFormData {

    public readonly edit: boolean;

    public readonly errorSchema: any = {};

    public readonly errors: any[] = [];

    public readonly formData: {[key: string]: string} = {};

    public readonly idSchema: {[key: string]: any} = {};

    public readonly schema: {[key: string]: any} = {};

    public readonly status: string = "submitted";

    public readonly uiSchema: {[key: string]: any} = {};

    constructor(edit: boolean, errorSchema: any, errors: any[], formData: { [p: string]: string }, idSchema: { [p: string]: any }, schema: { [p: string]: any }, status: string, uiSchema: { [p: string]: any }) {
        this.edit = edit;
        this.errorSchema = errorSchema;
        this.errors = errors;
        this.formData = formData;
        this.idSchema = idSchema;
        this.schema = schema;
        this.status = status;
        this.uiSchema = uiSchema;
    }

}
