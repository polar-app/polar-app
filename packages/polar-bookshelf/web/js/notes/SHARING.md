- capabilities we need
    - share publicly and indexable via google
    - share publicly hidden from google
    - Invite more editors, commenters, and viewers
    - Remove access for any collaborator
      



- we need rw and ro permissions
- ro permissions need to have SOME sort of clarification that it's open
- 

- public sharing with out being indexed via google
- public (not indexed directly published to search engines)
    - add metadata bout this not being indexable.



permissions matrix

                                                  owner          editor         commenter         viewer
manage permissions                                yes            yes            no                no 
edit the note and create new sub-notes            yes            yes            no                no
add comments                                      yes            yes            yes               no 
view the notes                                    yes            yes            yes               yes

export type PublicSharePermission {
    readonly type: 'public';
    
    /**
     * When true this is not visible in a users profile.
     */    
    readonly hidden?: boolean;
}

export type ShareRole = 'owner' | 'editor' | 'commenter' | 'viewer'; 

export type GroupSharePermission {
    readonly type: 'group';
    readonly gid: UIDStr;
    readonly role: ShareRole;
}

export type UserSharePermission {
    readonly type: 'user';
    readonly uid: UIDStr;
    readonly mode: ShareRole;
}

export type SharePermission = GroupSharePermission | UserSharePermission;

interface ShareToken {

    readonly id: string;
    readonly created: string;
    readonly uid: UIDStr;
    
    /**
     * The root of a tree that this user has shared. It can be any part of a sub-tree
     */
    readonly root: NodeIDStr;
    
    readonly permissions: ReadonlyArray<SharePermission>
     
}

- maybe make it so that the token has targets 
