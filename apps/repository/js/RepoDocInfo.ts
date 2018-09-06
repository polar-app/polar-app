/**
 * Just like a DocDetail or DocInfo but designed to be used for in the UI so we
 * replace missing titles with Untitled and define other default values.
 */

interface RepoDocInfo {

    fingerprint: string;
    title: string;
    progress: number;
    filename: string | undefined;
    added: string | undefined;
    flagged: boolean;
    archived: boolean;
}
