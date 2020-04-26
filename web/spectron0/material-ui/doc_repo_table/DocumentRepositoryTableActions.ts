import {Clipboards} from "../../../js/util/system/clipboard/Clipboards";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {Callback1} from "polar-shared/src/util/Functions";
import {Directories} from "../../../js/datastore/Directories";
import {FilePaths} from "polar-shared/src/util/FilePaths";

export namespace DocumentRepositoryTableActions {

    const copyText = (text: string) => {
        Clipboards.getInstance().writeText(text);
    };

    export interface Actions {
        readonly onCopyOriginalURL: Callback1<RepoDocInfo>;
        readonly onCopyFilePath: Callback1<RepoDocInfo>;
    };

    export function create() {

        function onCopyOriginalURL(repoDocInfo: RepoDocInfo) {
            copyText(repoDocInfo.url!);
        }

        function onCopyFilePath(repoDocInfo: RepoDocInfo) {
            const filename = repoDocInfo.filename!;
            const directories = new Directories();
            const path = FilePaths.join(directories.stashDir, filename);
            copyText(path);
        }

        return {
            onCopyOriginalURL,
            onCopyFilePath
        }
    }

}
