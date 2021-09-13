
## group

|| id || required || string || the ID of the group ||
|| name || optional || string || the name of the group ||
|| slug || required || string ||  The slug for this group (derived from the name). ||   
|| orgID || optional || For organizations the org_id is their org.  This allows us to avoid name conflicts as a group name doesn't have to be global ||
|| visibility || required || private | protected | public || The visibility of this group and who can read it ||
|| tags || required || Up to 5 tags picked for this group.  No more than five. || 
|| nrMembers || required || automatically updated via transaction when a user joins a group ||

### Visibility:

- ```private``` Only users that are members can read documents in this group and see other users.
- ```protected``` Only shown if the user has a URL to it directly.  NOT indexed via Google.
- ```public``` Anyone can read/join this group and add documents and annotations.

When the user shares with a public or protected group we need to denote that their
document is now 'public' and anyone can see it.  With a 'don't show this again 
for public groups' option.  Either that or just denote the security in the 
document directly.

## group_admin 

Stores various admin settings for this group.  NOT visible to users including the 
admin and moderators.

## group_doc

|| groupID || required || string || The group this document belongs to ||
|| docID || required || string || the users docID for this doc ||
|| doc_info || required || object || denormalized doc_info from the user explaining what's actually in this document || 

# group_member



# group_member_pending

    readonly to: EmailStr;

    readonly token: string;

    readonly message: string;

Used to notify the user of a document being shared with them or to just invite
them to a new document with that group.

## user_group

Contains the groups of which the user is a member.

The user CAN NOT write this record. They can only read it.

The key is the uid of the user. 

|| groups || required || ReadonlyArray<GroupIDStr> || The groups which this users is a member. For public groups this is more like a 'bookmark' since this isn't used for permissions. ||
|| admin || required  || ReadonlyArray<GroupIDStr> || The user is an admin on these groups ||
|| moderator || required  || ReadonlyArray<GroupIDStr> || The groups for which this user is a moderator ||

## user_group_pending

## doc_permission

A de-normalized version of docMeta (visibility and groups) so that we can
resolve the document permissions during datastoreGetFile efficiently.  Only
written if the doc is protected | public or is a member of a group.

|| groups || The groups that this doc is shared with || 
|| visibility || required || private | protected | public || The visibility of this group and who can read it ||
                                                    


## contact

A contact that you've interacted with in the past either as a friends or a handle. 

Used to keep track of everyone you've collaborated with so auto-complete can work.

### fields

|| id || required || A unique contact ID for this user and they are sharing some selected information about their profile ||
|| uid || required || The UID for the owner of this contact ||
|| rel || required || ReadonlyArray<RelType> || The list or relationships for this contact. ||
|| email || optional || string || Their email address.  This is only known if we've directly invited them via email ||
|| profileID || optional || string || Their profileID.  This is only known after we've invited them and they have an account here. ||
 
### type RelType = 'friend' | 'shared';

- friend: We've added this user as a friend

- shared: We've shared a document with this user.

## profile 

Contains a reference to a user by either uid or handle.


# TODO
    - TODO the users contact table has to be updated after we Join the group... 

    - we need a new table which contains a high level list of the new documents 
      for the group from each user as well as oeverview of teh canonitcal doc 
      name and doc info... 
