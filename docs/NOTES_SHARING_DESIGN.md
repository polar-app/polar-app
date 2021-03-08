# Sharing

discussion...

We support the following general permissions model:

    - a page is collection of blocks that form a tree and has a name
      
    - pages are grouped into a collection called a namespace. Which we call a
      nspace to avoid collision with the Typescript 'namespace' keyword.
      
    - namespaces can be connected to either users or organizations.
    
    - There is a default namespace for both users and organizations that can't
      be deleted and is where all notes go by default.
        - TODO: what does roam do?
      
    - Both pages and namespaces support permissions and setting perimssions on a
      page will be merged with the permissions for the namespace with the
      permissions for the page taking presidence. Example: if Alice has write
      permission in the namespace but read permission on the page, then her
      effective permissions will be 'read'.
      
    - We have the following permission levels:
         - owner: read, write, comment,  
      
    - Note paths and namespaces.
    
        - When the user is in the current namespace the page name paths are just [[MyPage]] with
          no special prefixes.
          
        - To link to a page in a different namespace for the same user the path
          is [[MyNamespace/MyPage]] with no @ handle prefix.
          
        - To link to another user/org note in THEIR default namespace we would use [[@alice/TheirPage]]
        
        - To link to another user/org note in THEIR default namespace we would use [[@alice/TheirPage]]
      
        - To link to another user/org note in a non-default namespace we would use [[@alice/TheirNamespace/TheirPage]]
      
        - Internally these are not actually saved into the note and instead we link
          to the specific node ID with a name alias that is changed on render.  This
          is stored as [[12355|MyPage]].  The 'MyPage' string is actually changed
          based on the namespace and user context.
        
        - TODO: people could spam you and clog up your inbound references view at the bottom.

    - only the owner can share to the web
        - TODO: can other people be owners?
        - TODO: owner vs admin
       
    - the owner can control all the permissions for web users including whether they can edit
      the data, view it, or comment.
      
        - TODO owner vs admin      

    - When the page is shared with the web the owner can control granular SEO
      permissions like noindex, nofollow, etc.

    - The user can delegate re-sharing capability such that Alice can share with
      Bob and he can be given the ability to share that with Carol, etc.
      
    - There CAN NOT be any possibility for privilege escalation.  For example
      Alice can't share ro with Bob and then Bob could grant rw to Carol.

    - A user CAN NOT attempt to share something to which they are not the owner
      and don't have re-share capablities and rules must prevent this.
  
    - organizations can have groups... like accounting, etc.
  
    - organizations can have additional settings like:
        - disable web sharing
        - disable sharing with members outside the organization
        - enable sharing with the following organizations.
        - only allow users from @example.com domain
        - require two-factor auth
        
# Default Namespace

The default namespace MUST be computed at random and we must look it up because otherwise
there could be collisions based on the uid or profile renaming.  It would be nicer to compute
from a constant but there IS no constant.

# Applying Permissions to Firebase Rules

In order to have firebase rules work, we have to take the permissions at the
organization, namespace, and page level and rewrite them into sets of UIDs like
so:

FIXME: we shouldn't ALWAYS have to have a list of UIDs here right?  Orgs with thousands of users would bloat 
this data structure and we might want to make the 'org' session trait... 

block_permission_org
    ro: ReadonlyArray<UIDStr>
    rw: ReadonlyArray<UIDStr>

block_permission_nspace
    ro: ReadonlyArray<UIDStr>
    rw: ReadonlyArray<UIDStr>

block_permission_page 
    ro: ReadonlyArray<UIDStr>
    rw: ReadonlyArray<UIDStr>
    
# Users Reading Snapshot Data

FIXNE: 

In order for the user to get the data they have access to, we maintain a separate table called
    
    
NOTE: Firestore CAN do an IN clause so that's ok but we MIGHT have to do two
queries / snapshots to get it but that's not the end of the world.  

# Schema

## nspace 

Keeps track of all the namespaces in the system.   Note that a namespace does
NOT have a UID because it can belong to an organization.

```text
nspace {

    /**
     * The ID of this namespace.
     */
    id: IDStr;
    
    /**
      * org or profile handle (acme or burtonator)
      */
    owner: HandleStr;
    
    name: NSpaceNameStr;
    
    description: string;
    
    created: ISODateTimeStr;
    
    // people who have been added to this 
    members: ReadonlyArray<INamespaceMember>;
    
}
```

### nspace_member

Structure for storing the members.  

```text
INamespaceMember {
    readonly id: IDStr;
    readonly uid: UIDStr;
    readonly added: ISODateTimeStr;    
    readonly role: 'owner' | 'admin' | 'user';
}
```

# Permissions

// TODO: view/comment rights should be delegatable if the user doesn't have delegation rights.

// TODO: would be good to keep a log of permission changes and who did them and
// when they happened - another enterprise feature.

// TODO: page permissions have to take presidence over nspace permissions and override them.

/**
 * Holds the permission that the user has set for nodes... 
 */
block_permission:

    /**
     * The uid of the user that created this permission object so that the user
     * can enumerate the permissions they've created.  We can track the chain
     * back to the root this way.
     */
    uid: UIDStr

    /**
     * The original owner of the block. 
     */
    owner: UIDStr;

    /**
     * The block (root) that we're sharing.
     */
    block?: BlockIDStr

    /**
     * The namespace we're sharing.
     */
    nspace?: NSpaceIDStr;
    
    /**
     * Set when the user is sharing it with another user.
     */   
    user?: UIDStr;
    
    /**
     * Set when we're sharing this document with the web for SEO purposes.
     */
    web?: boolean;
        
    /**
     * Permisions for anyone who's a member of this organization.
     */
    organization?: OrganizationIDStr;
        
    // edit: can view, comment, and edit
    // comment: can view and comment
    // view: can view but not comment
    
    /**
     * The actual permissions:
     *
     * ro: read-only
     * rw: read-write 
     */
    permissions: 'ro' | 'rw';
    
    /**
     * Do not allow the user to comment.
     */
    noComment?: boolean;
    
    /**
     * When true, do not allow allow this user to share this document with other
     * people.
     */
    noDelegate?: boolean;
    
    /**
     * For SEO set the noindex flag.
     */    
    noIndex?: boolean;

    /**
     * For SEO set the noarchive flag.
     */    
    noArchive?: boolean
    
    /**
     * For SEO set the noSnippet flag.
     */
    noSnippet?: boolean
    
    /**
     * For SEO set the noFollwow flag.
     */
    noFollow?: boolean;   
}

/**
 * History of the permission changes
 */ 
block_permission_log
    uid, 
    

## user_block_permission

Each user can get their own permissions to with they were granted by reading
from user_note_permission and looking at the user column.

```text
user_block_permission
    uid: UIDStr;
    notes_ro: ReadonlyArray<NodeIDStr>
    notes_rw: ReadonlyArray<NodeIDStr>
    nspaces_ro: ReadonlyArray<NamespaceIDStr>
    nspaces_rw: ReadonlyArray<NamespaceIDStr>
```

This table is ro, but not rw or the user would be able to change their own
permissions... it's updated by ChangeBlockPermission hook.


/**
 * Denormalized list of namespaces the user owns.  This way they can get their
 * list of namespaces and this is also used for permissions.
 */
user_nspace:
    id: UIDStr; 
    uid: UIDStr
    nspaces: []

/**
 * Denormalized access to the user permissions that the user has when they to go
 * read, edit a block.
 */
user_block_permission
    id: UIDStr
    rw_blocks: []
    ro_blocks: []
    ro_nspaces: []    
    rw_nspaces: [];    
}

## SEO / SSR

SSR request would have to look at the URL, see if the note is shared with 'web'
or if the nspace is shared with the web. and then allow/deny the request
accordingly.  We'd have to be careful of the block embeds though because they'd
be in security context.

## Changing Permissions

- MUST be done online because it requires changing user_block_permission which 
  the user does not have access too.

## block_permission rules

I think it would be better to have the rules for updating this structure in a
trigger because they're somewhat complex.

```

match /user_nspace/{document=**} {
    allow read, write: if (resource == null || request.auth.uid == resource.data.uid);
}

match /block/{document=**} {
    
    allow read: if get(/databases/$(database)/documents/user_block_permission/$(request.auth.uid).ro_blocks.hasAny(resource.data.root);
    allow read, write: if get(/databases/$(database)/documents/user_block_permission/$(request.auth.uid).rw_blocks.hasAny(resource.data.root);

    allow read: if get(/databases/$(database)/documents/user_block_permission/$(request.auth.uid).ro_nspaces.hasAny(resource.data.nspace);
    allow read, write: if get(/databases/$(database)/documents/user_block_permission/$(request.auth.uid).rw_nspaces.hasAny(resource.data.nspace);

}

```

-- allow a write if the block uid is the same as the auth uid.     
# allow write if block.uid === auth.uid;;    
  
-- allow a write if the delegatedFrom record has noDelegate=false and the permissions aren't escalations   
    
## block rules

Rules for writing blocks should be straight forward if we basically allow a write if ANY of the parents 
give write access to the current uid.  We keep the 'parents' as an array of all the parents. 

We CAN NOT do any type of transitive lookup and the lookups have to be done simply.

Something like

```
allow write if block.nspace == get(/databases/$(database)/documents/block_permission/$(resource.data.groupID));
``` 

# Limitations:

- All permission change operations have to be done via a cloud function due to needing to mutate data structures 
  the user granting the permission does not own.

## Allowing the client to read their *local* permissions so they can determine WHAT they can read/write
    
## TODO

- How do we do permissions on the permissions.  For example, we have to reject a
  write to a note when the user doesn't have permissions to change its permissions.

- how do I do a block embed such that the parents and structure is setup
  properly. It's a weird situation...

- block / embeds won't work with my schema will they? this is another note...
  entirely... and when we replace it in the UI there will be some confusion
  because the parent and parents will be from a totally different tree...
    - I think you would ALSO have to be given part of that other tree... I can't
      figure out a better way to do this, except maybe if I update the rules so
      that the anchor block has some special meaning.
    - we can do it as a kind of parent I think... but if we go to  
    
- We will have to VERIFY the parents so that people can't lie about that.
    - We might just have to do a recursive lookup until we hit the root  
    -  I can NOT use a trigger here because it won't work on read... only write.

- I COULD have the client read the list of permissions, then provide the ID of
  the permissions object that the client thinks allows the write... that would be
  a simple check on the server.


- there are limits to the security rules:

    https://firebase.google.com/docs/firestore/security/rules-structure#recursive_wildcards

    https://firebase.google.com/docs/firestore/security/rules-conditions#access_other_documents

    - there are no for loops... 


- there are two types of rules we need:
    - read rules that HAVE to be rules or else the user could read data to which they don't have access
    - 

- join obsidian discord

    - graphs in webworkers!!!

- we're going to have a problem if someone has a block embed to another block that's in anpther graph and you
  don't have access to it.. clicking on it could ask for permission. 

- TODO: design of an address book so people can keep track of who they've shared data with. 

- FIXME: figure out how the cloud security rules have to work ... then figure out the reverse system from there... 

- A USER that has a default namespace is the admin and it can't be deleted or
  delegated to other users.

- FIXME: what happens to your data when you try to come online again and you've had revoked permissions.

- FIXME: how does a user see who has access to to a note so that they can change permissions and it would also be nice
  to know who they are collaborating with.

- FIXME: a user should NOT be able to escalate their own permisions.

- FIXME: how are we going ot do permissions for groups of users like 'accounting...' ?  

## To Review

- roam
- remnote
- relanote
- 

