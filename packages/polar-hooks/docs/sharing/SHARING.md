# Overview

Sharing Design in Polar


# Issues

## When you share a document from someone can they later revoke their permissions to access the document?

Yes.  We should allow this though it's a rare use case.  We might also want to 
preserve the original user who shared it with us so that we can warn the user 
that they are about to block the original author.   

However, you're essentially  GIVING the document to someone thi sway.


# Building Fetch URLs

As part of the doc permission system we need a way to grant+revoke and a token 
needs to be used.  Otherwise, once the user has the token, they will have
permissions in perpetuity. 

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

- TODO: we might need to do this on the backend so that the permissions works.

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

- Initially we have NO limits on who can be added.  We add everyone in the 
  chain this way people can discover one another indefinitely.  The one issue 
  here though is latency.  Users are going to pop in all at once.      

# Message Delivery

- email and using mandrill with mailchimp so that when someone is added they 
  get a transactional email from the user.

- TODO we need to settle on a system for transactional email.  Sendgrid is just
  too pricey.

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

- Implement testing of the FULL user flow throughout the app including the rejection... 

- Implement the proper getFile() in the API which reads the token from our doc_permission.

- Test that I can fetch URLs properly
    - update the security rules in the main polar firebase project
    - run the tests THERE ... 

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
 
 - Alice gives access to either:

     - ```share_target_team```: a team (via her list of contacts) that she has already
       joined.
     
     - ```share_target_existing_email```: to an existing user contact (that she's
       added previously)
     
     - ```share_target_new_email```: or via a (new) contact (via email address) 

 - If ```share_target_new_email```
     - New email (Bob) goes into her 'contacts' as a table entry for
       auto-completion in the future.
    
     - An email is sent to Bob letting him know what a document has been shared 
       with him.

     - Alice will update ```doc_permission``` with a record pointing to Bob 
       to allow him to read the document.
        
     - A ```doc_peer``` record is written to Bob and from Alice giving Bob access to
       the DocID created by Alice.  This DocID can then be used by Bob to access all
       the resources of Alice's shared document (including image files).
           
     - Bob logs into Polar and sees a new document shared with him via the
       notifications bar at the top.  We can find this by looking at the 
       ```doc_peer``` table to see which records have not been ```accepted```.
       
     - Bob accepts this document by clicking the 'add' button in the
       notifications dropdown.
       
     - We then migrate the ```doc_peer``` ```from``` column to use a contact_id
       and migrate this user into a contact. 
   
     - Once added Bob has a sharing section with a peer reference to Alice's doc.
       Has added Alice as a contact, and a reciprocal 'grant' is given to Alice 
       directly via the same mechanism of the ```doc_peer``` system only this 
       time Alice automatically accepts it since it's ```reciprocal```.  Note
       that we have to validate this reciprocity to make sure it's legitimate.
       
     - At this point both Bob and Alice are sharing access to each others's
       documents.

  - If ```share_target_team```: (this part is tentative)
     - An email is sent to everyone in the 'team' letting them know that Alice
       has shared a document with them.
       
     - Alice updates doc_peer granting access to anyone from that group access
       to her document record.        
  
     - Alice will update ```doc_permission``` with a record pointing to the team to
       allow him to read the document.
       
     - 

 
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

We would use a similar algorithm to this:  

# Future 

- design the fan out system for the 'river of annotations' view for each  
  user. I might have to have a cloud function do this and to the fanout directly 
  and maybe via batches.  This might not scale too... if it's via a hook it might 
  take a while though.
    
    - This is also needed for the group system so I can share this code.  Just
      design the system, don't build it now.  Designing it means that I at least
      think through all the problems so I don't back myself into a corner.
      
    - this won't be built out just yet...    
               
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

# Multiple Email Addresses

Allow users to add multiple email addresses to their account by just adding the
email, sending a challenge nonce, then clicking a link to verify it properly.
 
We can just use an email_challenge feature and then associate all these
emails with your account via a set.     


# Token sharing "anyone with the URL"

 - we expose the raw doc ID in the URL?
    - are there any downsides to this?  I don't think leaking it is a problem
    
    - JUST create a sharing URL and then that URL adds it to the users doc repo 
      by doc ID and we have a special 'token' in there or something or 'linked'  
      
    - 'public-via-link:' is the sharing mechanism there needs to be an associated 
      permission with th is.  The link itself adds the doc to the users repo.

    - TODO: the problem with this strategy is that there's no way to revoke
      access once the URL is given out.

    - TODO: 
        - I can do a get() on the user_token for that user and the doc token 
        to see if that user has access to that token but the gets are going to 
        more expensive.  However, we can move on from this in the future
        and provide a smarter mechanism later. 

    - I think this is the only real way we can do this honestly.
    
    - 

## TODO
  
  
- we have to have some sort of doc membership for the groups where users assert
  that they have added a document to a group.

- I don't think we need docPeer.token. which is used the the user to access 
  another doc.  We just have to see if they are in the list of authorized 
  access... but we DO need this for the HTTP requests I think so I'm wrong. 

    - we can write our token to the group_permission but we but how would we remove it???
    
        - we could implement a hook for this... this is probably the best/only 
          way to do it.  We would have to validate this on the server side.
           
    - the user could keep their OWN record of the token if they wanted
    
        - API call of groupAddMember  

- ok.. it's hard to know for sure but I think teh way to do it is to have the 
  group_permission table store the tokens and ALL documents in the same 'group'
  reference this for lookup.  This way we do NOT perform permission exists 
  if that doc isn't a member of a group.

    - group_peer is only to discover members of that group...
    
    - anyone doc within that group uses that group_permission table unless
      the group is open.  
  

- if I have an 'origin' in a doc_peer can't I get most of what I want?  I would 
  just reference a separate table which ONLY the other notes... 
  
    - shit ... I'm still back to the issue where I need too many tokens I think.
    
    - THAT and I need to have a way to keep the sysmem in sync with groups.  

- The group ID for a document could be the doc ID the root / primary doc and 
  we could specify type=doc.   

- public/private has to do with what is or is not discoverable.  Not who can 
  read/write to the group.  We might also want read/write access to groups.  
  
  It might be nice to have a group 'ro' where people in the given permission can 
  see what people are talking about but not comment.
  
  - also:
      - can it be indexed by google
      - can it be discovered ?    

- If Alice shares with Bob and Carol how does Bob discover Carol? Bob can
  discover Alice and vice versa but Alice can't discover Bob.  Use the same 
  token for everyone?  That would not work of course because then there is no 
  way to revoke a specific user.
  
    - set permissions on doc_peer so that other users shared with those users 
      can read from doc_peer directly...  
         
    - the major problem we have now is that this is a N^2 issue where we would 
      have to push node_peer records out to everyone.  IF we instead used a 
      hierarchical system that would work much better but node_peer would need
      permissions to allow readers in doc_permission too but this doesn't seem 
      too hard.

    - we would have to rewrite doc_peer to accept just ONE record with a 
      recipients set...  
  
    - We CAN NOT do that because each user has their own token that would be 
      given out. We have a problem now with token distribution...
      
    - this is N-1*N edges per group... A better solution would be just having N 
      records.  We would have to do this in a hierarchy though but what if the 
      original user stopped sharing their document.  
      
      - Also, how do we clean up after the fact?   Maybe this is a feature.  If 
        they want more complicated group membership use a team and add/remove
        people from that team?
        
      - this way I can push people into private teams...
      
    - here's A solution:
        - grant each user permission to write to the node_peer and 
          node_permission table
          
          - allows us to make this configurable by the owner (allow users to 
            add others)
            
          - is hierarchical and scales
          
          - FIXME: How do we allow the to NOT see the tokens of other users.  OH!  
            these are in the doc_permission table not the doc_peer.
            
          - FIXME: How do we grant access to each users document?  We would have 
            to refer back to the root_doc_id         
           
          - FIXME: this will require hooos because the original user could 
            go away. 
            
          - Maybe add recursive sharing later... or requests to access the 
            document might be a better strategy for now... then we could make
            automatic approval a pro feature.
            
          - 
            
    - consider reworking this entire thing as groups.  Regular named groups and 
      headless groups that are created for subsets of users which don't have a 
      name.  
      
    - using groups means that we can't do network analysis attacks to violate
      a persons privacy.
      
    - we can have a groups field that explains which groups have access to a 
      document and we can FIRST check if the groups field exists and that it has 
      members before we do a lookup against the groups tables and this will save 
      money from performing needless writes.
      
    - teams can be de-normalized on every write so that RBAC works properly.
    
    - only the team owner(s) can add and remove members from the group.  The 
      owners can grant access to other owners of course but maybe not in the 
      initial version.
      
    - We will need the ability to convert a headless group, to a real group in 
      the future but we can do that by just going through the naming lookup 
      process and then attaching the name.
      
    - make sure I can have a document that is shared with multiple groups and
      that this model works.  Alice should share doc0 with Bob  and Carol could
      share the same doc0 with Bob.  Both Alice and Carol could have found it
      independently and both Alice and Carol wouldn't know about each other.
      
    - headless can have multiple owners too but this would have to be an 
      'allow others to invite' and I think this would just be a 'mode' for 
      a group where it's open or moderated.
      
        - membership as 'open' or 'moderated'
        
        - if we lookup the group and it's public then we do not need to keep a 
          membership record 

    - We are going to need a reverse group -> document lookup but also a 
      doc->group lookup

    - we can store content for a doc via a group_content record which is 
      basically an reverse index of the annotations+comments.  We might even 
      want to group these into pages so that the number of reads we do is 
      limited.  We could put this JSON behind a CDN too so that everything is 
      cached.

- TODO: how do I do token sharing ??? it will work for everything BUT the 
  firebase doc... and I am not sure how to support it...
    - one thing is to expose the key directly as the token? Then I remove the 
      token as part of the permissions in the future ?   

- We need a reverse chronological timeline for groups and users. I think this
should generally be the same structure and just store a ordered list of
annotations which can then be viewed in the UI.  We're going to go after users
first and view their stream of annotations.

- backend components working first
    
    - get the 'fetch' API call to work so I can fetch resources
    - revoke permissions
    - tokens to work and the sharing URL to work

- review the following group permissions systems 
    - google drive
    - github
    - slack








