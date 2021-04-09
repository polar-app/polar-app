/**
 * A facade on top of DocMeta for view in the UI
 */
import {RepoDocInfo} from './RepoDocInfo';
import {IDocAnnotation} from "../../../web/js/annotation_sidebar/DocAnnotation";

export interface RepoDocMeta {

    readonly repoDocInfo: RepoDocInfo;

    readonly repoDocAnnotations: ReadonlyArray<IDocAnnotation>;

}
