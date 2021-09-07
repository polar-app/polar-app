### [Go Home](./NOTES.md#table-of-contents)

<div align="center">

# Notes Design

</div>


## Table of Contents
1. [Overview](#overview)

<br />
<hr />

### Overview

The notes system uses is a hierarchical tree structure composed of pages which,
when combined forms a [graph](https://en.wikipedia.org/wiki/Graph)

A page is basically a tree with a name. So for example "World War II" could be a
page with children under it.

A page is a [tree](https://en.wikipedia.org/wiki/Tree_(graph_theory)) which
means it has no cycles back to the root and all children are descendants of the
parent.

### Persistence and Concurrency

When we discuss concurrency here we're talking about the concurrency of multi-person edits.

Persistence and concurrency are connected since if we were to design the
persistence layer without thinking about concurrent edits it would be possible
for someone to accidentally overwrite someone else's edits which would defeat
the entire point of collaboration.

We evaluated multiple models for our concurrency model and decided on a compromise
between ease of implementation and usability.

The best model to use would probably be something based on full [Operational
Transform](https://en.wikipedia.org/wiki/Operational_transformation) (also known
as OT) but I think this would take about 3-6 months to implement with a team of
2-3 and would be very prone to complicated edge cases.

Instead, we designed a system based on
[LSeq](https://www.researchgate.net/publication/262162421_LSEQ_an_Adaptive_Structure_for_Sequences_in_Distributed_Collaborative_Editing)
(linear sequences) which is a somewhat straight forward algorithm and maps well to Firestore concurrent write primitives.

This means that two or more people can edit the same page/tree and generally not conflict.   

It's an optimistic concurrency model which assumes that it's very rare that two
people would edit the same bullet point at the same time.

The *main* area of corruption would involve people overwriting the 'items' of a block thereby potentially losing
children which LSeq solves.

The tradeoffs here involve:

 - It's possible that two people, editing the same bullet point at the same time
   can conflict where one overwrites the other's edits.  This is mitigated by the
   way Firestore pushes updates to the client.  If both clients are online the
   data for that page will be updated in realtime so that the persons latest edits
   will be pushed out to all parties.
   
- There's no inherent 'presence' information like in OT.  The presence functionality 
  allow us to show which users are editing which bullet points in realtime.  We can 
  add this on top in the future if necessary using Firestore cloud push of events to the
  client showing which users are editing which notes.
  
### LSeq

LSeq (or linear sequences) is used to maintain the 'items' structure.

Basically the way LSeq is structured is that instead of installing things as a
list where anyone can append, set, we structure it as a map where the key is the order.

In order to build the final list we sort the keys the list is then the linear
order of the values of the map.

So for example a map of:

```
{
    "2.0", "4"
    "1.0", "3"
    "3.0", "5"
}
```

would yield a list of 

```
['3', '4', '5']
```

## Firestore Persistence

The persistence model of this is somewhat straight forward.

When we go to mutate a block in Firestore we don't do a set on the full
document. Instead, we use a Firestore 'field path' to set some fields and
then to use ```FieldValue.delete()``` to remove a value or just update to insert
new values.

For example:

```
db.collection('block').doc('1245')
        .update({
            'items.1' : firebase.firestore.FieldValue.delete()
            'items.2' : "2"
        })
```
 
Would delete the item with key '1' from 'items' and then add a value for '2' with the value '2'.

The rest or fields we would set to the new value.

This would still take advantage of Firestore transactions, caching, etc.

When we mutate multiple blocks, these would need to be done in a Firestore transaction.

For example, if we split a block, thereby creating two new blocks, We would have to make two block changes.

We would have to:

- Create a new block with the split suffix text 
- Update the parent with new items
- Change the original block content

All of this has to be done in a Firestore transaction. 
 
# Undo / Redo

The undo/redo system in the blocks store uses a general / global Undo/Redo queue that is
available as a context.

The idea being individual stores can push undo actions into one global store.  This way
you can undo operations in storeA followed by storeB. 

This enables the stores to work together collaboratively. 

## Undo Diff Computation

We have a custom undo action building system which first computes all potential
blocks that *could* be mutated and then determines which were ACTUALLY mutated
when the user wants to undo/redo.

This is done by tracking a field called ```mutation``` which is incremented 
every time the block is changed.

There's also another field `mutator` (a unique device identifier) which enables us to verify that a undo/redo operation isn't changed by
someone else because if userA mutates a block that is shared, userB could try to
undo that operation.  What we do now is that we abort 'content' changes to that
block but still allow 'items' mutation since the user intent can be preserved
thanks to LSeq.

Example of multiple users updating content:

**User A**

```json
{
    "content": {
        "type": "Hello",
        "mutator": "user-a-device-id",
    },
    "mutation": 1,
}
```


<br />



**User B**

```json
{
    "content": {
        "type": "Hello world potato?",
        "mutator": "user-b-device-id",
    },
    "mutation": 2,
}
```

Now when **User A** tries to undo, they won't be able to, because the last update to `content` was done by **User B**,
and we can't let **User A** undo the changes of **User B**.

This is done by using a `mutator` field which holds a unique device identifier, and on every change to content we update `mutator`
to match the device id of the person that did the change.


# Undo and Persistence Cooperation

## Writes

On write, the persistence layer is given a set of blocks that have been mutated
as before/after pairs.

There is no visibility into the undo/redo system or why a mutation is performed.
It could be a normal 'forward' operation or an undo operation.

The persistence layer is just given an array of these before/after pairs and 
it then mutates these according to a Firestore persistence layer implementation.

## Updates

Updates to the data are done via Firestore snapshots.  We use the 'docChanges' field
to figure out what has changed, then we do a doPut() on the store directly which 
updates the UI.

The 'mutation' is changed on the block to allow the UI to know that data has changes 
when trying to do undo/redo operations.

# Sharing

Thie sharing model is extensible and allows us to implement a basic v1 with an
initial form of sharing now, and a more complicated, "enterprise-ready" sharing
model in the future.

All the IDs in the system are globally unique, so it's easy to refer to nodes across 
namespaces created by other users as they will not collide.

A link to a named note is actually a link to the ```id``` with just an alias for it 
stored in the text.  This way we support cross-namespace linking.

## Model

We support the following general permissions model:

    - A page is collection of blocks that form a tree and has a name.  For example, "World War II" 
      
    - pages are grouped into a collection called a namespace. Which we call a
      nspace to avoid collision with the Typescript 'namespace' keyword.
      
    - namespaces can be connected to either users or organizations and have owners.  
    
    - There is a default namespace for both users and organizations that can't
      be deleted and is where all blocks go by default.  Each user and 
      
    - Both pages and namespaces support permissions and setting perimssions on a
      page will be merged with the permissions for the namespace with the
      permissions for the page taking presidence. Example: if Alice has write
      permission in the namespace but read permission on the page, then her
      effective permissions will be 'read'.
      
    - We have the following permission levels:
         - owner: User has all write permissions and can also:
            - delete this object (org, namespace, etc)
            - grant other people access
            - change SEO permissions
            - update metadata for an object
                - for a block - change the cover sheet, icon
                - update title, description, image, etc for a namepsace. 
         - write: All comment permissions but user can also write to the block.
         - comment: All read permissions and user can add comments to the block.
         - read: User can read this block.
         
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
          is stored as [[MyPage]].  The 'MyPage' string/link is actually changed
          based on the namespace and user context.  Internally this is handled by having a 'links' 
          property which includes the actual ID that the user is linking to.  The text is just 
          what the user typed initially.
        
        - TODO: people could spam you and clog up your inbound references view at the bottom if we are not careful. 

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

FIXME:
The ```notes_permission``` table stores the underlying permissions structure and
rules.  These are applied, and an effective* permissions system is then computed
and saved into ```user_block_permission``` table which we then lookup during
Firebase security rules during read/write.

# Effective Permissions

Page level permissions override namespace level permissions.  

So if a user is rw at the namespace level, but ro at the page level, the
effective permissions are ro.

Here's a matrix to clarify:

```text
                   nspace ro | nspace rw  | nspace undefined |
--------------------------------------------------------------
page ro          | ro        | ro         | ro               |
page rw          | rw        | rw         | rw               |
page undefined   | ro        | rw         | no access        |
--------------------------------------------------------------
```

The EFFECTIVE permissions do not need to be show in the UI when configuring
permissions at the page level.

The user sets permissions on the namespace, and page level, but when changing
them on the page level we merge the inherited namespace permissions and show the
effective permissions.

If the user selects the same permissions that would normally be inherited from
the namespace they can just be removed from the page level and probably SHOULD
for performance reasons.

# Users Reading Snapshot Data

In order for the user to get the data they have access to, the
```user_block_permission``` table ALSO has needs to keep the effective
permissions so that ANYTHING in these tables can be read and we can perform
a snapshot to start reading ANY of that data.
    
Additionally, in the UI, we have to show that the user can not write some fields
and might need some sort of UI treatment for that.    
    
## Reading Snapshot Data

Firestore supports an IN clause so that we can read from ANY namespace to which
the user has permissions.

This will scale well with the Firestore cache performance issues we're seeing. 
The only issue is we have to have two snapshots, one for the pages and one for
the namespaces.

## Secure Permissions Changes via ChangeBlockPermission Cloud Function

All permissions changes are mediated by the ```ChangeBlockPermission``` cloud
function.

This validates all changes so that the users can't do anything like privilege
escalation and that we have a log recording all permissions changes.

This also mutates ```user_block_permission``` for the user so that they have the
right values there which the user can't actually mutate directly because it
belongs to other users.

### Groups and Other Advanced Permissions

The ```ChangeBlockPermission``` function can take arbitrary rules like only
accept users from the organization that have been given a tag and then apply
them that way.  This way a subset of the users is computed and only their
```user_block_permission``` is changed. 

## Ranking Blocks and Comments

This system needs to have support for both ranking blocks and sorting them, and
a link to a comment thread.

The comments system needs to support upvotes so that high quality comments are
surfaced.

Thee permission system supports this model by having a page that's not directly
linked, but linked to via a 'comments' property on a block that points to
another block which is a tree of comments.

Since ranking can be supported in each sub-item, and we can set the sub-items
sort of 'ranking' we can support both ranking for comments but also ranking for
regular notes so users could have things like voting systems like reddit but
also with rich discussion.

## Reset of Page Permissions

A user might want to reset all page permissions or find out which ones have
customer permissions other than those inherited from the namespace.

The ```block_permission``` table keeps track of the namespace that this block is
stored along with the page so we can always fine pages in a namespace that have
custom permissions.

# Schema

This is a minimal and proposed schema. There might be other fields in the future
like a photoURL, etc.

## High level list of tables and what they store:

Note that these tables are NOT specific to the block system necessarily because
I want to try to unify doc_meta and doc_info and make these root page block
types. 

```text

profile: contains profile data for a user.  
org: The metadata for an org including the id, name, description. 

org_user: All the users and roles for the org. This stores the users and their
          roles in the org. We have owner, admin, user.  A user is just a regular user
          that can create blocks and share with the org. An admin as all the permissions
          of a user and can add new users to the org, create groups, and change
          permissions for users in those groups. An owner has all the permissions of an
          admin but can also change billing for the org and delete the org.
  
org_group: All the groups associated with an org, their id, name, description.
nspace:  The declaration of a namespace, it's id, name, and description 

# FIXME: these aren't actually required because we can write
# block_permission_user records and store the 'owner' permission for the nspace
 
nspace_user: The namespaces that a user owns. Each has a unique id, uid, and a nspace_id
nspace_org: The namespaces that an org owns.  Each has a unique id, uid,   

block_permission: 

    Permission structure configured by an 'admin' for a page or nspace and
    specifies who has access to the page. This controls the high level
    permissions so that when the admin wants to enumerate who has access and to
    restore those permissions the admin opens a dialog to change the
    permissions. Other user can see the data here but can not make changes. 
    There are two types of permissions stored here, page and nspace.  The ID is
    computed using either the nspace ID or the block ID.

block_permission_user: 
    
    The effective permissions for a user and which pages and namespaces they
    have access to. This table serves two main purposes. 1.  The user reads this
    table so they can knows which blocks they can access. 2.  The Firestore
    rules system uses this table to assert permissions so that a user can't
    read/write data which they're not allowed to access.
                            

```

FIXME we're going yto migrate to a uid of __public__ which is a special uid and
has special rules for public access of content.

There are essentially two types of public access:

- unauthenticated users - Users browsing public pages on the web including googlebot and other robots.

- authenticated users - These are users that the user doesn't explicitly give permissions too other than 'public' but authenticated users 
                        have the ability to comment + write (not just read). 

## org

Metadata about an organization.  This is not mutable directly and must be changed via a 
cloud function.

### main operations

- for a user, get their namespaces.

### schema

```text
org {

    // random ID for this org
    id: OrgIDStr;

    // time the org was created
    created: ISODateTimeString;
    
    // name of this organization
    name: SlugStr;
    
    // a description of this organization
    description: string;

    owners: ReadonlyArray<UIDStr>
    
    members: ReadonlyArray<UIDStr>
    
    // the list of namespaces associated with this org
    nspaces: ReadonlyArray<IDStr>;
    
}
```

## org_user

Denormalized list of organizations a user is a member of.  The user can not work
with this data directly and it's computed via a cloud function to mediate
permissions.

```
org_user {
    id: UIDStr 
    orgs: ReadonlyArray<OrgIDStr>
}
```

## nspace 

Keeps track of all the namespaces in the system.   Note that a namespace does
NOT have a UID because it can belong to an organization.

Namespaces do not have a list of members as their permissions are applied via the
```block_permission``` system and the members are generally compiled via the members
of the organization.

The permission builder can source the members from the org and then the rules there
get saved to determine who can have access to the permissions.

The namespace has the following permissions:

owners:
    - can delete the namespace (if it's not the main namespace for a user or org)
    - can invite other users as owners to this namespace
    - can grant other users permissions to manipulate and work with the namespace.

```text
nspace {

    /**
     * The ID of this namespace.
     */
    id: NSpaceIDStr;
    
    name: NSpaceNameStr;
    
    main: boolean;

    description: string;
    
    created: ISODateTimeStr;

    updated: ISODateTimeStr;

    owners: ReadonlyArray<UIDStr>;

    writers: ReadonlyArray<UIDStr>;

    commenters: ReadonlyArray<UIDStr>;

    viewers: ReadonlyArray<UIDStr>;

}
```

## nspace_user

Allows a user to list the organizations to which they below AND to assert
permissions on reading them.

```text
nspace_user {

    id: UIDStr;
    nspaces: ReadonlyArray<NSpaceIDStr>;
}
```

# FIXME each permission object should have a base set of properties that gets normalized out...
# writers, commenters, readers, and a set of permissions for SEO too (when that comes online) 

## block_permission

Holds the permission that the user has set for notes... 

```
block_permission:

    /**
      * Same ID of the block root which we're changing permission.
      */
    id: BlockIDStr;
    
    /**
     * Set when the user is sharing it with another user.
     */   
    user?: UIDStr;
    
    /**
     * Set when we're sharing this document with the web for SEO purposes.
     */
    web?: boolean;
        
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

```

## block_permission_user

Each user can get their own permissions to with they were granted by reading
from ```block_permission_user``` collection for the user.

Note that this we apply the permission based on namespaces and blocks here and 
the minimum permission applies. 

```text
block_permission_user
    uid: UIDStr;
    blocks_ro: ReadonlyArray<NodeIDStr>
    blocks_rw: ReadonlyArray<NodeIDStr>
    nspaces_ro: ReadonlyArray<NamespaceIDStr>
    nspaces_rw: ReadonlyArray<NamespaceIDStr>
```

This collection is ro, but not rw or the user would be able to change their own
permissions... it's updated by ```ChangeBlockPermission``` web function.

FIXME the user_block_permission would be for the USER not for the web. we would
need some structure for this so that SEO content can easily determine if it's
public.

## notes_permission_web

Table for web content so that we can lookup via block ID to see if the content is public 
and what the permissions are

TODO: what about commenting here...  I do think that should be a high level permission

```text
block_permission_web
    // the block ID that's been published
    id: BlockIDStr
    permission: 'ro' | 'rw'
```

## user_nspace 

FIXME: this is nspace_user
FIXME: do we need this?

/**
 * Denormalized list of namespaces the user owns.  This way they can get their
 * list of namespaces and this is also used for permissions.
 */
user_nspace:
    id: UIDStr; 
    uid: UIDStr
    nspaces: []

# SEO / SSR

SSR request would have to look at the URL, see if the note is shared with 'web'
or if the nspace is shared with the web. and then allow/deny the request
accordingly.  We'd have to be careful of the block embeds though because they'd
be in security context.

# Firebase Rules
I think it would be better to have the rules for updating this structure in a
trigger because they're somewhat complex.

```

match /user_nspace/{document=**} {
    allow read, write: if (resource == null || request.auth.uid == resource.data.uid);
}

match /block/{document=**} {
    
    function getNotesPermissionUser() {
        return get(/databases/$(database)/documents/notes_permission_user/$(request.auth.uid);
    }

    allow read: if getNotesPermissionUser().ro_blocks.hasAny(resource.data.root);
    allow read, write: if getNotesPermissionUser().rw_blocks.hasAny(resource.data.root);

    allow read: if getNotesPermissionUser().ro_nspaces.hasAny(resource.data.nspace);
    allow read, write: if getNotesPermissionUser().rw_nspaces.hasAny(resource.data.nspace);

}

```

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

# External Notes + Documentation 

- these are limits to the security rules:

    https://firebase.google.com/docs/firestore/security/rules-structure#recursive_wildcards

    https://firebase.google.com/docs/firestore/security/rules-conditions#access_other_documents

    - there are no for loops... 

    
## TODO

- FIXME: TODO for v1 we can/should allow nspace to be undefined which means that there actually IS no namespace
  and the permissions are just done on a per user bases... 

- FIXME: how does a user see who has access to a note so that they can change permissions and it would also be nice
  to know who they are collaborating with.

- TODO: note that block embeds won't necessarily be shown if the user doesn't have permission to it... we can use the
  ```user_block_permission``` to figure this out 

- TODO: design of an address book so people can keep track of who they've shared data with in the past

- FIXME: what happens to your data when you try to come online again and you've had revoked permissions.... I think 
  the rest of the data might not be committed and this would be a huge problem

- TODO review https://www.enterpriseready.io/

## To Review

- roam
- remnote
- relanote
- 


# Reading/Writing Data 

        [ Firestore ]                   [ BlocksStore ]                      [ React ]
             <----------- useSnapshots -------|        
             |----------- snapshot data ------> 
                                              |--- updated data ----------------->                  [1]
                                              <------------ doPut, doDelete -----|                                   
             <------------ write -------------|
             
             
1.  The UI would be updated here via RJXS and MobX
2. 
             
             
             
             
