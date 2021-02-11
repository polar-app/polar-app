---
title: Mendeley's Encrypted Repository is Fundamentally Anti-Science
date: 2019-01-23 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/anti-science-scaled.jpg
description: Hacker News ran a story the other day highlighting Mendeley locking in users to their product by encrypting their own data preventing external apps from easily exporting their data. 
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/anti-science-scaled.jpg">

# Mendeley's Encrypted Repository is Fundamentally Anti-Science 

[Hacker News ran a story](https://news.ycombinator.com/item?id=18977461) the
other day highlighting Mendeley locking in users to their product by encrypting
their own data preventing external apps from easily exporting their data.

Essentially, PDFs go in, but they don't come out - a black hole of knowledge.

Now one might be temped to think that an application encrypting user data is 
a good thing.  Less ability to tamper with the data or for 3rd parties to 
watch what you're doing.

Usually this is done at the OS-level.

However, there certainly are reasons why you would want an app to have full
end-to-end encryption.  However, usually the owners have full access to the 
keys and ways to share data with other users.

## On Lockdown

In this situation this seems like it's just Elsevier (the company that owns
Mendeley) locking users out of their own data.

Zotero, a 3rd party app that also manages research [implemented an
exporter](https://www.zotero.org/support/kb/mendeley_import) so that they could
migrate people from Mendeley but now that path is blocked.

This is fundamentally anti-science.  We should be building bridges not walled 
gardens.

This isn't the first time Elsevier has been accused of anti-scientific behavior.

They recently had a [small mutiny on their
hands](https://www.insidehighered.com/news/2019/01/14/elsevier-journal-editors-resign-start-rival-open-access-journal)
when the entire editorial board of the Elsevier-owned Journal of Informetrics
resigned:

> The entire editorial board of the Elsevier-owned Journal of Informetrics
resigned Thursday in protest over high open-access fees, restricted access to
citation data and commercial control of scholarly work.

> Today, the same team is launching a new fully open-access journal called
Quantitative Science Studies. The journal will be for and by the academic
community and will be owned by the International Society for Scientometrics and
Informetrics (ISSI). It will be published jointly with MIT Press.

## Anti-Scientific

Now I say this is anti-scientific as it goes against the scientific ethos of 
sharing knowledge.

Most of the papers in a person's repository are open access and freely licensed.

Why does it need to be encrypted?

## Full Disclosure

Now in the interest of full-disclosure, access to the Mendeley PDF repository
would be very helpful for Polar users as well.

We have a number of feature request for transparent sync between Polar and
Mendeley (and Zotero too) where Polar can detect PDFs and automatically 
import them into your repository for annotation.

That avenue (at least for Mendeley) is cut off and Polar won't be able
to easily implement that feature.

What makes matters worse is that due to the fact that the [SEE encrypted
library](https://eighty-twenty.org/2018/06/13/mendeley-encrypted-db) is proprietary 
Zotero or Polar would have to acquire a license in order to import directly from
Mendeley.

## GDPR?

Now Mendeley has been open about this and [posted a tweet](https://twitter.com/mendeley_com/status/1006915998841221120)
explaining their side of the story.  That it was for GDPR compliance but
our friends on Twitter weren't really happy with this explanation:

> Excuse me? Do I get it right that @mendeley_com has suddenly encrypted my own
data on my own harddrive, without either informing me nor asking for my
permission?

> An infinite thanks for this tweet which comforts me in my idea not to use your system

I also find that this is a really shocking revelation that they tried to hide
behind GDPR for this action.

However, the GDPR explicitly has a requirement for data export:

["Right to data portability"](https://gdpr-info.eu/art-20-gdpr/)

>The data subject shall have the right to receive the personal data concerning
him or her, which he or she has provided to a controller, in a structured,
commonly used and machine-readable format and have the right to transmit those
data to another controller without hindrance from the controller to which the
personal data have been provided, where:

> the processing is based on consent pursuant to point (a) of Article 6(1) or
point (a) of Article 9(2) or on a contract pursuant to point (b) of Article
6(1); and the processing is carried out by automated means.

>In exercising his or her right to data portability pursuant to paragraph 1, the
data subject shall have the right to have the personal data transmitted directly
from one controller to another, where technically feasible.
  
It seems like they're violating the GDPR here by not allowing you to freely 
export their data and allow the user to work with 3rd party applications.

Either way though I think this is not going to end well.  Scientists have a way
of rebelling against closed systems.  

For our part, your Polar data will always be open.  In fact we store the data
directly on disk in raw JSON form alongside the raw PDF.  

We're also Open Source so if something isn't working properly you can fix it
yourself or just read the source code to understand how everything is put
together.

# Conclusion

Until Elsevier comes out with an API to easily allow users to export their data
I would recommend that people stay clear of Mendeley. Use something like Polar
or Zotero which is Open Source and won't lock you into a walled garden.

Honestly, I hope I'm wrong here and someone from Elsevier/Mendeley comes forward
and points out that we're incorrect - that there's a simple export API and
hopefully points us to the right documentation.

Should that happen I'll update this post.  I truly hope that this is a all just
a big misunderstanding.
