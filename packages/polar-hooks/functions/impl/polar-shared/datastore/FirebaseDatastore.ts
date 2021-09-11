
export interface StoragePath {
    readonly path: string;
    readonly settings?: StorageSettings;
}

export interface StorageSettings {
    readonly cacheControl: string;
    readonly contentType: string;
}
