  
# Protocol walk through.  

## Individual user to user sharing with headless groups.  

  - A user wants to share a document with their colleagues
    
    - They go into Polar and click the share button on the doc.  This brings
      up a dialog box that prompts them for email addresses that they can add.

    - The user then calls a cloud function called groupCreate (though this might
      need to be groupCreate or groupCreateOrUpdate or groupSetup)
      
        - this provisions the group:
        
        - sets the permissions (private)
        
        - adds the users group_admin.members.pending

        - we write a user_group_pending record for this user to accept/reject
        
        - this optionally has a document that the user can reference if it's 
          one or more documents that are being shared with them. 
  
  - User is told about a new group (doc) that they can read
  
    - This is done by adding a new user_group_pending table.  This is also done
      when they are invited to private groups.  Public groups don't need
      this type of permission.  The user can just add themselves by the hook.
      
        - But they can STILL be invited to a public group via this record if a 
          new group is created plus we could use ML to match /suggest groups
          for them to join.   
      
        - The permission for interacting with the group is mediated via a hook
          and the user can not mutate this data directly.
          
        - This also updates a user_group table which just has a list of the
          users groups they have access too.  This is used for authentication 
          later and we read the user_group table to compute the group IDs and 
          then the doc itself has a 'groups' record or 'visibility' that can 
          be used.
      
  - User then adds the document to their own repo
        
        - they mutate their doc to add a 'groups' field on it.  This is just
          the group ID and gives anyone in that group access to their document.

            - security rule will be 
            
            - groups != null && groups.length > 0
                 - then read the user groups and see if their groups are within this set
          
        - they then call groupAddDoc which mutates group_docs which is just a 
          single document with all the users who are collaborating with that 
          group and sharing their doc_meta
    
            - this includes a token so that people can access the document
              via the token directly.
              
            - we then store this token in doc_permission too so that when teh 
              use performs a fetch they get validated against it via their
              token.
              
        - TODO ... since we are using a HTTP fetch any via cloud functions do 
          we even need the token?  We can just read the users group membership 
          and read the doc.groups.
          
            - it might be best to have doc_permission too though becuase thats
              a much faster read.  
   
    - user_group table
    
        - user only has read based on their uid
        
        - only written to via hook and admin because we have to mediate the 
          permission of the         

        - This is read on startup and is secure because only the admin can write
          it. The user can READ it they just can't write it.



## Public access / public groups 

    - the doc is stored with the group as a ```group_doc``` record
    - the doc is mutated by makign it 'public' by setting visibility. 
