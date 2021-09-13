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

https://firebase.google.com/docs/firestore/security/rules-conditions#access_other_documents

```text

    match /doc_meta/{document=**} {

        /**
          * Get the doc permissions or an empty version with an empty recipients.
          */
        function hasDocPermission() {
            return exists(/databases/$(database)/documents/doc_permission/$(resource.data.id));        
        }

        /**
          * Get the doc permissions or an empty version with an empty recipients.
          */
        function getDocPermission() {
            return get(/databases/$(database)/documents/doc_permission/$(resource.data.id));        
        }

        
        function getDocPermissionRecipients() {
            return getDocPermission().data.recipients;  
        }
                            
        allow read: if resource == null || (request.auth != null && request.auth.uid == resource.data.uid);
        
        // TODO migrate to custom claims for all the users email addresses                     
        allow read: if hasDocPermission() && getDocPermissionRecipients().hasAny([request.auth.token.email]);

        allow write: if request.auth != null && (resource == null || request.auth.uid == resource.data.uid);

    }
 
    match /doc_peer/{document=**} {
        allow read, write: if resource.data.uid == request.auth.uid;
    }
    
    match /doc_peer_pending/{document=**} {
        
        // the user should only be able to read their OWN pending documents.
        allow read, delete: if resource.data.to == request.auth.token.email;

        // TODO: update this to use ALL of the users emails via custom claims  

        allow write;
        
    }

    match /doc_permission/{document=**} {
        
        // the user should only be able to read their OWN permissions.
        //
        // only update if you're the owner which I need to do when accepting 
        // an invitation to a document
        //
        // only delete it if we're the user otherwise you could delete someone's
        // peers without their permissions.       
        allow read, update, delete: if resource.data.uid == request.auth.uid;

        // only done during the initial grand period and anyone should be able 
        // to do this so that we can give the user access to our document.
        allow create;            
    }
  

```


## doc_peer

Only the USER should be able to read their doc_peer but anyone can write to it.

This is needed because we need to 'give' access to another person by writing 
the new record.

## doc_permission

Only the primary user has access to read/write this record.  This controls all
their permissions

# New Rules

```text


    function hasUserGroup() {
        return exists(/databases/$(database)/documents/user_group/$(request.auth.uid));        
    }
    
    function getUserGroup() {
        return get(/databases/$(database)/documents/user_group/$(request.auth.uid));        
    }
    
    function getUserGroupGroups() {
        return getUserGroup().data.groups;  
    }

    match /group{document=**} {
        // only allow members of this group to read which documents are 
        // contained here. Writes are not allowed because they are implemented 
        // via a cloud hook.
        allow read: if hasUserGroup() && getUserGroupGroups().hasAny([resource.data.group_id]);
    }

    match /group_doc/{document=**} {
    
        // TODO: need permissions if the group is public or protected... 
    
        // only allow members of this group to read which documents are 
        // contained here. Writes are not allowed because they are implemented 
        // via a cloud hoook.
        allow read: if hasUserGroup() && getUserGroupGroups().hasAny([resource.data.group_id]);
    }

    match /doc_meta/{document=**} {
                            
        # if the document is missing allow read because we need to show that it's not present
        allow read: if resource == null;

        # if the visibility is public we're ok with sharing 
        allow read: if resource.data.visibility == 'public';

        # If the user is the owner they can read it obviously                            
        allow read: if request.auth != null && request.auth.uid == resource.data.uid;
        
        # allow read on this document if it was added by the user to a group.
        allow read: if resource.data.groups != null && resource.data.groups.length > 0 && hasUserGroup() && resource.data.groups.hasAny(getUserGroupGroups());

        allow write: if request.auth != null && (resource == null || request.auth.uid == resource.data.uid);

    }

```
