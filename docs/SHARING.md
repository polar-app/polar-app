# Overview

Sharing Design in Polar

# Datastructure

Update the DocMeta to include a new sharing section that's a sibling to DocInfo 
(DocSharing?)

```

{
    /**
     * Stores the high level sharing permissions for the document including 
     * where we received and who has been given access.
     */
    sharing: {
        
        // FIXME: this is now a doc_peer table.
        
        /**
         * Contains a list of users that are also sharing the same document that
         * we're collaborating with (all the peers in the group).
         */
        peers: [
            {
            
                /**
                  * True when this is the original user who granted us access
                  * to the document.
                  *
                origin: true,

                /**
                 * The time we discovered this user.
                 */                
                discovered: "2008-09-15T15:53:00+05:00",
                
                /**
                 * The owner of this document in our 'contact' table.     
                 */
                contact_id: '',

                /**
                 * The user ID of the owner, denormalized from the contact ID.
                 */
                user_id: '',
            
                // The `doc_id` is needed in the source so that we can use
                // FileRef when the user calls BackendFileRefs.toBackendFileRefs
                // I can compute/add the required metadata that needs to be
                // attached to the FileRef to denote whether they are the owner
                // or not and who the owner is and how we build the URL
                // properly.
                // 
                // We then lookup the data on the backend permissions system so
                // that we verify that the user actually DOES have access to the
                // file.

                doc_id: '0x000'
                
                /**
                 * The last version of this document we've seen.  This is used 
                 * to determine if we need to update in the UI.
                 */
                uuid: string,
                
            }            
        ]
                
    },
    
    // FIXME: this is now a doc_permission table.
    
    // The new permissions section includes who has access to this document for 
    // reading our comments, notes, etc.  By default a document is private 
    // and no one can access it.
    
    permissions: {
    
        // who has been given access to this document.
        recipients: [
            'mailto:alice@example.com',
            'mailto:bob@example.com',
            'group:zivalkuru9zvjmc9oxvjzkuxvi',
            'group:zxv9jweroiuzsvmioseurw',
            'token:acvm9uqw3erjlzuxv'
        ]
        
    }
    
}
```

# Tables

## doc_peer

Grants permission for a user to access a document.  This is basically a 'grant'
datastructure which gives the user the pointer to the doc_id to read.

|| id || The DocID of the document ||
|| from || FirebaseUIDStr || from this user ||
|| to || FirebaseUIDStr ||  to this user ||
|| reciprocal || boolean || True if this is a reciprocal grant so that the original user can get access to the doc meta back ||
|| message || string || A message given to the user in the original grant so that it can show up in the UI for them to understand why this document was given to them ||
|| accepted || boolean || True if the user accepted this document || 

## doc_permission

Contains the permissions set for the user for this document in their repo.

By default the document is private (no permissions).

TODO: there is a simpler version of this that needs to be stored within the 
DocMeta directly...

### schema

|| id || The DocID of the document ||
|| uid || The users uid that owns the id (DocID) ||
|| fingerprint || The fingerprint of the document in the doc repo ||
|| recipients || An array of encoded recipients who have access to the document || 

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

## contact

A contact that you've interacted with in the past either as a friends or a handle. 

Used to keep track of everyone you've collaborated with so auto-complete can work.

### fields

|| id || A unique contact ID for this user and they are sharing some selected information about their profile ||
|| rel || ReadonlyArray<RelType> || The list or relationships for this contact.
|| name || string || Their name ||
|| image || Image || The image URL to their profile with src, width, and height ||    
 
### type RelType = 'friend' | 'shared';

- friend: We've added this user as a friend

- shared: We've shared a document with this user.

# Issues

## When you share a document from someone can they later revoke their permissions to access the document?

Yes.  We should allow this though it's a rare use case.  We might also want to 
preserve the original user who shared it with us so that we can warn the user 
that they are about to block the original author.   

However, you're essentially  GIVING the document to someone thi sway.

# Firebase Rules / Permissions.
    
We store the permission and sharing structure in a separate doc. This way the
actual sharing settings aren't shared across and given to people with their
documents.

These are stored in ```doc_permission``` and ```doc_peer``` tables.

A new DocMeta rule should be:

```

  function hasRecipientByEmail() {
    return resource.data.recipients.includes('mailto:' + request.user.email);
  }

  allow read: if hasRecipientByEmail();
   
```                

# New users without accounts

One issue is how do we give documents to users who have not yet entered the
system.

We're going to solve this via doc_peer_pending which is only resolved on initial
account creation.

On initial account creation we lookup the doc_peer_pending table and migrate
these into doc_peer with the correct 'to' address.

We then delete the originals.

We are going to have to mark the 'account' so that we can know that we've 
migrated the records properly.

This will have to be a boolean that we flag at the end.

# Custom Claims in the Future

In the future we might be able to use custom claims to speed up authentication.  

With 1000 bytes this would allow about 125 groups MAX but in practice it's more 
like 100 since I probably have to encode them.  I might want to just store these
encoded in an efficient string.

This would speed up auth but it's a bit more complicated right now. 

# Transitive Discovery 

This idea is generally that ANYONE that is sharing a document has access to 
everyone else.

I think we should consider making this a feature later but it would require 
changes on the client.

This is done by sharing the value of the doc_id AND updating the doc_permission.

The USER has to change the doc_permissions setting.  Just because someone has
the value of a id doesn't mean they can actually read the document.

The idea here is that we implement this in the client such that we look at 
everyone we've given access to, find their doc_peer settings, then automatically
change OURS adding them and giving them permission.

We would need to implement this on the client and make it a premium feature to 
disable. 

## TODO

- Initially we have NO limits on who can be added.  We add everyone in the 
  chain this way people can discover one another indefinitely.  The one issue 
  here though is latency.  Users are going to pop in all at once.      

- email and using mandrill with mailchimp so that when someone is added they 
  get a transactional email from the user.

- TODO: need the structure for user pages so that users can link to their 
  timeline of documents, comments, and highlights.

    //
    // - We need 'anyone with the link can view' semantics which DOES require
    //   a token BUT we can make a special recipient of 'token' that has the
    //   token that you can use to view the document.

- TODO: should we have some sort of RBAC?

- TODO: I don't like how this is seemingly ad hoc and the schema for permissions 
  isn't defined very well.

# Solution to group membership problems:

We cna use hasAny method in list which will resolve this nicely as long as the
strings match up properly

https://firebase.google.com/docs/reference/rules/rules.List
https://firebase.google.com/docs/reference/rules/rules.Map


## Groups 

In the future we're going to need to have a separate group 

## Rules behavior and caching. 
    

https://firebase.google.com/docs/rules/rules-behavior

"Some document access calls may be cached, and cached calls do not count towards the limits."


# Implementation Strategy

- how do I allow the user to control who has access to see their shared contacts 
  for documents?
    I guess I could punt on this now and add it later?

- the first big milestone I have to implement is changing the permissions with 
  one user and then fetching again with another user to make sure they can 
  access all the resources properly.

    https://firebase.google.com/docs/firestore/security/rules-conditions#access_other_documents

- FIXME: how do we want to handle the case where a user has been invited to share
  a document but it not yet a polar user?  
    
    - email addresses might be case sensitive so we can't just lowercase them...
    - PUNT on this problem for now.  I could build some way to solve this in 
    the future.       

- the current 'permissions' system of 'private' or 'public' with the DocMeta 
  won't really work with the new system so we have to upgrade the permissions 
  there to match this.  It was never deployed though so we're good.  I think we 
  just have to update the firebase permissions to match this system but I need
  to figure out how to write it and test it. 



1.  Write the data structure to firebase via test/command line so that we can verify that the data is written properly
2.  Write the hook on the backend to pass the request through with the proper lookup mechanism.
3.  Make sure the sharing data structure is serialize properly.  


# Topic / Group strategy

For now do not implement topics. It's going to be far more complicated.  We just
need to get basic sharing to work.  

The owner of the group controls the membership and then we do a get() on the 
group membership for permissions within firebase security rules.


# Data flow of sharing process

 - Alice wants to share a doc  and clicks 'share' in the sidebar
 
 - Alice gives access to a team (via her list of contacts) or via a (new) 
   explicit email or recycles one from their contacts.  She eventually 
   just grants Bob.
   
 - Bob goes into her 'contacts' as a table entry for auto-completion in the
   future.
   
 - An email is sent to Bob letting him know what a document has been shared 
   with him.
   
 - A doc_peer record is written to Bob and from Alice giving Bob access to the 
   DocID created by Alice.  This DocID can then be used by Bob to access
   all the resources of Alice's shared document (including image files).  
   
 - Bob logs into Polar and sees a new document shared with him via the
   notifications bar at the top.
   
 - Bob accepts this document by clicking the 'add' button in the notifications 
   dropdown.
   
 - Once added Bob has a sharing section with a peer reference to Alice's doc.
   Has added Alice as a contact, and a reciprocal 'grant' is given to Alice 
   directly.
   
 - At this point both Bob and Alice are sharing access to each others's documents.
 
# Dynamic and realtime updates to the DocMeta / viewer.

We've never had the ability to update the DocMeta and reload the viewer so we 
have to add support for that.

This will involved:

- Adding a snapshot listener to wait for updates for any of the peer documents
  and the master document.
  
- The datastore will need to support this.

- When the update is detected the TARGET metadata will be merged with the new metadata

- During the update we will disable persistence so that any updates we make are 
  NOT written back out to disk. 
   
- We might have to have one MASTER document for persisting writes and one for 
  showing in the UI.

# Top Friend Recommendation

We need to have TWO top friend recommendation systems.

The first is global. This is our fallback. This will be the top users in the 
system. We use this to bootstrap and then we start migrating the user to their 
own personalized system.

Next, we just to a basic collaborative filtering system where we take the 
users friends, then their friends, and rank them by counts on the backend with 
a cloud function.

We cache this and updated it if it's stale on login when the user logs in and
it hasn't been updated in 24 hours. This should allow us to reduce our total 
computational complexity for this component.

The TOP recommender algorithm would probably need to use google cloud big query 
or something or maybe pagerank (ideally) so that we have a robust top user 
ranking system.       

This would only run on top documents.

I think I can get this query down to less than 5 seconds if done properly.

https://docs.google.com/spreadsheets/d/1eYnlXwNVGiDHo07pNAVU_Fjc9UwHrdYyMbYhhK8L8SM/edit?usp=sharing

This would only be about 100 requests and we can use both the global and local 
data to compute this.  For example we can take the top ranking users local to 
each user OR we can compute their local rank if there's overlap.

The math for this worked out (for a basic algorithm) to be about $360 per month
on firebase if we only focused this on the local graph and only read the friends
of the user to 1 degree.  This wouldn't be a massive amount of data and we could
recompute it every hour.

The only way we enable the secondary / user-specific algorithm is if there is
enough overlap for specialized recommendations.  We would need to have 5-10 head
nodes with > 10 ranking.  Once these are ranked just fetch their metadata
directly.



# Recommended reading

We would use a similar algorithm to this 

# Future 

- design the fan out system for the 'river of annotations' view for each  
  user. I might have to have a cloud function do this and to the fanout directly 
  and maybe via batches.  This might not scale too... if it's via a hook it might 
  take a while though.
    
    - This is also needed for the group system so I can share this code.  Just
      design the system, don't build it now.  Designing it means that I at least
      think through all the problems so I don't back myself into a corner.
      
    - this won't be built out just yet...    

