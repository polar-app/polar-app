# Sharing

We support the following general permissions model


- parents
- permission is driven by parents

# Permissions

We need the ability to share with other users (and possibly group in the future)

user_note_permission:

    /**
     * The uid of the user that created this permission object so that the user
     * can enumerate the permissions they've created.
     */
    uid: UIDStr

    /**
     * The note that this applies to.  Perissions apply to the note and all its
     * descendants.
     */
    note: NoteIDStr
    
    /**
     * Set when the user is sharing it with another user.
     */   
    user?: UIDStr;
    
    /**
     * Set when we're sharing this document with the web for SEO purposes.
     */
    web?: boolean;
    
    /**
     * Set when this user is sharing with a group (placeholder).
     */
    group?: GroupIDStr;
    
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
    noShare?: boolean;
    
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
    
## TODO

- sharing to the web is the same as sharing with a user... sort of...
