export interface IStorageReference {
    readonly child: (path: string) => IStorageReference;
}
