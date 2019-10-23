import {RepoDocInfo} from "../RepoDocInfo";

/**
 * The selected documents currently being dragged.
 */
export class DraggingSelectedDocs {

    private static value: ReadonlyArray<RepoDocInfo> | undefined;

    public static get(): ReadonlyArray<RepoDocInfo> | undefined {
        return this.value;
    }

    public static set(value: ReadonlyArray<RepoDocInfo>): void {
        this.value = value;
    }

    public static clear() {
        this.value = undefined;
    }

}
