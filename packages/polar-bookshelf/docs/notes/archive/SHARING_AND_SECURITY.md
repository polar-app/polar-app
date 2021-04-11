- tags to control how to share public and private information
- the security rules should be

  user=request.user || document.public
    
- social data should map to an index ID which must be specified.

- The sharing key can be revoked and the user has a mapping between 
  their shared representation of a document ID and the document ID 
  for the user.  
  
  For example.  If the user is reading doc ID 101 it's not possible 
  to publicly get that document because it's not public.  Instead 
  they have to query for the annotations DIRECTLY with the list of
  people they are following and the CORRECT document hashs.
  
- when the user publishes annotations they have to write a key for
  all their users so that they can read the documents they've 
  published and only people they are sharing with can see the 
  documents.