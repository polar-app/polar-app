/**
 * Denotes the 'mode' of this Pagemark.  By default a pagemark mode is 'read'
 * but we can also mark it 'ignored' to note that we're going to skip this
 * section of content.
 */
export enum PagemarkMode {

    PRE_READ = "PRE-READ",

    READ = "READ",

    IGNORED = "IGNORED",

}
