# Overview

Sharing Design in Polar



    // FIXME: this is a problem because in the UI we are generating a custom
    // download URL for the file but the OTHER resources will not have this
    // param so we're unable to get them. I might have to have a way to store
    // this in the main JSON file itself so that I can get access to it from
    // within all layers of the system.
    //
    // In fact, yes I do because the getFile() method will need this metadata
    // to build a NEW type of URL for each file which we can COMPUTE of course
    // but I need a hint to be able to do it.
    //
    // TODO: I can fix this by putting this metadata in the FileRef so that when
    // the user calls BackendFileRefs.toBackendFileRefs I can compute/add the
    // required metadata that needs to be attached to the FileRef to denote
    // whether they are the owner or not and who the owner is and how we build
    // the URL properly.  What metadata do I need to include?
    //
    //  - if I can keep the DocMetaID in the doc itself then what I can do is
    //    use THAT to store the keys I need to lookup the file and compute the
    //    URL myself but what am I going to call this new field.
    //
    //  - what are we going to call this file??
    //
    //  - we can specify to load a specific doc_id in the URL for the viewer
    //    rather than loading a fingerprint but right this isn't supported.
    //
    //  - I think the BEST way to do this is to have a sharedWith param and then
    //    have a set of additional doc meta IDs there and then fetch those and
    //    store them along side the main this way the user can add the main
    //    document and it seems like a normal document to them but we have
    //    additional metadata as a new state.json file but it's referenced via
    //    its doc_meta_id directly and not the users own doc_meta_id. this way
    //    the user can turn on/;off.
    //
    //  - use a new 'sharing' data structure
    //
    //  - sharing: {
    //        settings: {
    //
    //        }
    //
    //
    
    //        peers: [
    //            {source: 'firebase', doc: '1x001'}
    //        ]
    //    }
    //
    //     - TODO: is this open ended?  What if alice shares it with bob who in
    //             turn shared it with carol.  This would be alice->bob->carol but
    //             who controls the spread of the information?
    //
    //     -
    //
    // - Should the 'sharing' data be
    //
    // - We need 'anyone with the link can view' semantics which DOES require
    //   a token BUT we can make a special recipient of 'token' that has the
    //   token that you can use to view the document.

# Datastructure

```javascript

{
    /**
     * Stores the high level sharing permissions for the document including 
     * where we received and who has been given access.
     */
    sharing: {
        
    }
}
```

# Tables

## message

Stores a message for an 'inbox' that is displayed to a user. The messages are 
type do we can have user to user messages but also features like a user added 
you as a contact or a user shared a document with you.

We us this for two main reasons:

- to notify you when someone has added you as a friend

- to notify you when you have a new document you can add to your repo.

## contact

A contact that you've interacted with in the past either as a friends or a handle

### fields

|| source || 'firebase-us-central1' || The source of this friend. Could be something outside of polar.
|| rel || ReadonlyArray<RelType> || The list or relationships for this contact.  
 
### type RelType = 'friend' | 'shared';

- friend: We've added this user as a friend

- shared: We've shared a document with this user.

# Issues

## When you share a document from someone can they later revoke their permissions to access the document?

Yes.  We should allow this though it's a rare use case.  We might also want to 
preserve the original user who shared it with us so that we can warn the user 
that they are about to block the original author.   
