
# Use Cases

## Sharing Documents between users

Alice wants to invite Bob and Carol to collaborate on a document.  She adds them 
by email and they are invited and add the document to their doc repo.

They can then see each others annotations.  Alice can add more people and Bob 
and Carol automatically see the new users and their annotations.  

## Private Moderated Groups

Alice wants to create a private group named under her organization named 
'mathematics'.  

Alice creates the named group under her own namespace and she's now the owner.

She can invite other users and make then either owners or collaborators.                                                                                                                                  

Owners can invite others. 

## Private Moderated Groups with Teams

I think we can just do this by making a regular team but having all the group
access resolved by being denormalized. 

## Teams by token

We might might want to have a token URL that's handed out that allows everyone 
with the token to read the group.  If the token is removed the users no longer
have access to the group. 

This is "Anyone with the URL"... we could just encode the doc ID with a secret
in the URL and check the group permissions before we add it.

## Public Groups

End users can search for groups by name, tags and rank (descending).

They then have the list of groups in their folders sidebar and can interact 
with them directly.  Adding documents to the their document repo.

A group might not be discoverable .     

