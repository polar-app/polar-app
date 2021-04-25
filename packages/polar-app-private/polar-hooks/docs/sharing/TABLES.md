# Tables

## doc_peer (FIXME rework)

Grants permission for a user to access a document.  This is basically a 'grant'
datastructure which gives the user the pointer to the doc_id to read.

|| id || The DocID of the document ||
|| uid || FirebaseUIDStr || The owner of this record ||
|| contact_id || The contact ID in our contact database || From this user. We do NOT expose their uid and keep this private.  We use the email addr see ```from_resolution``` footnote ||
|| token || string || The token used by this user for accessing the resource ||
|| reciprocal || boolean || True if this is a reciprocal grant so that the original user can get access to the doc meta back ||

## doc_peer_pending (FIXME rework)

Used to grant docs to other people so that they can then store their own 
uid there. For now we use the users primary email but we could query for all
of them in the future as long as the user authenticates them properly.


```text
type UserIdentity {
    email?: EmailSTR,
    contact_id?: string    
}
```

### schema

|| id || specific IUD for this pending invitation ||
|| to || EmailStr || An email address for the user ||
|| token || string || The token used by this user for accessing the resource ||
|| message || string || A message given to the user in the original grant so that it can show up in the UI for them to understand why this document was given to them ||
|| reciprocal || boolean || True if this is a reciprocal grant so that the original user can get access to the doc meta back ||

### Footnotes

from_resolution:  We can't give out the uid due to security issues but what we
do do is provide access to the email. This is then re-written to import the 
email and contact info ito the users local contact database which is 
de-normalized from the main datastore. 

## doc_permission

Contains the permissions set for the user for this document in their repo.

By default the document is private (no permissions).

### schema

|| id || The DocID of the document ||
|| uid || The users uid that owns the id (DocID) ||
|| fingerprint || The fingerprint of the document in the doc repo ||
|| recipients || An array of encoded recipients who have access to the document || 
|| recipientTokens || A map of recipients and their tokens used ||  

### example:

```text
{
    id: 10101,
    uid: "12345",
    fingerprint: "12345",
    // who has been given access to this document.
    recipients: [
        'mailto:alice@example.com',
        'mailto:bob@example.com',
        'group:0001',
        'group:0002',
        'token:0003'
    ]
    
}
```

## message

Stores a message for an 'inbox' that is displayed to a user. The messages are 
typed do we can have user to user messages but also features like a user added 
you as a contact or a user shared a document with you.

The user will have a popup in the top right with messages and they can either
accept or deny documents that were added and also 'open' them.

We use this for two main reasons:

- to notify you when someone has added you as a friend

- to notify you when you have a new document you can add to your repo

### schema

||type|| shared_doc | new_friend || The type of the message for the user||

### messages types

- shared_doc: a new document has been shared with you

#### shared_doc

