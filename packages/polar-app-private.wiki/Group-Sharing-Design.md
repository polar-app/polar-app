# Polar Group Sharing Design

Polar groups are designed to allow our users to share their documents,
highlights (text highlights, area highlights), comments, and flashcards with
their colleagues.

# Key Features

- Create groups based on topic (philosophy, science, etc)
    - Support metadata on groups (description, links for more information, etc)
- List documents in the group so you can easily add them
- Dynamic/realtime collaboration on documents + comments
- List comments on documents for as conversations
- Realtime collaboration of documents
- public/private groups 

# Task Priority

- Improve the tag sharing with groups
- Focus on KEY functionality on groups so we can release it soon

# Status

MOST of the backend is completed, tested, and I'm somewhat happy with the code.

The major issue we have now is the frontend as I'm not happy wih the UI/UX here
and it doesn't seem very easy to use.

# Easy Sharing via Tag

Sharing documents with groups is something I want to actively encourage.

It means that the user would benefit from public discussion on the document
including any highlights and additional context made in the public group.

Additionally, all of the commentary by the USER would also contribute to the
public group.

## 5 tags per group

To facilitate matching documents the user is sharing to a group we support up to
5 tags per group.

We limit to 5 so that people can't tag spam with 100s of tags.  You have to pick
5. 

The idea is that when a user adds a document to their repository, we take the
groups they are a member of, and the tags they're using for the document, and
find groups with tags in common with the document. 

For example, if the user subscribe to 2 groups with the following name and tags:

bitcoin: cryptocurrencies, blockchain
linux: unix, compsci, programming

IE the "bitcoin" group would have tags "cryptocurrencies" and "blockchain" and the
"linux" group would have the tags "unix", "compsci", and "programming".

... then if the user adds a new document and selects the tag 'blockchain' we could
recommend sharing with the 'bitcoin' group because both the group and the document
share the tag 'blockchain'.

Here's a mock up I worked on (which I'm not happy with):

<img src="https://i.imgur.com/yT2PrWv.png">

### UI 

I'm not super happy with the way this UI turned out.  The UI for tagging the 
documents makes sense but I don't think it's very clear when listing the groups.

We would have to improve that and maybe have a standard 'view' for what a group
looks like.



