---
title: Portable Datastores and Platform Independence  
date: 2019-03-22 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/cloud-design-scaled.jpg
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/cloud-design-scaled.jpg">

# Portable Datastores and Platform Independence

The other day, Arnold Schrijver from the [Center of Humane Technology](https://humanetech.com/) was nice enough to reach out 
to discuss git sync in Polar and the available of Polar on other platforms
other than Firebase:

Polar's on disk datastore supports basic version control via git for advanced 
users.  It's somewhat easy to setup and provides a workable solution if you're 
a tech expert and you don't want to use Polar cloud storage.

> While I love the ideas and ease of use of Firebase et al, it being a Google
Cloud product does not fit well with the concept of Humane Technology and our
long-term vision..

> Lots of enthusiasm and good documentation for Firebase-related subjects (Cloud
sync). Extended features use Firebase ... Very thin documentation about Git sync.

This definitely true.  We don't really encourage Polar use to use git to sync 
their repositories.  

There are some practical restrictions with Git.  The biggest is that there's a
lack of real-time updates and notifications.  However, additionally git doesn't 
support large binaries very well.

It does generally work.  If you're technical then using git sync with Polar does
work as long as you make sure to always 'git add' the files on disk and then to
restart Polar every time.

Many our our users distrust storing their data in the cloud - or simply can NOT
use cloud at their job.

It's just not a very consumer-grade solution and our Firebase sync is really
really really easy to setup.

## Other Datastores

Polar isn't wedded to Firebase.  In theory it would be possible to support other
datastores.

Polar supports a 'Datastore' concept (which is really just an interface) so Polar supports a long term vision where 3rd parties could design their own datastores and tie them into Polar and just use that directly.

You can read about the [Polar Datastore interface here](https://github.com/burtonator/polar-bookshelf/blob/6cc76820ab3da2116f0b80f608d5f83f28082734/web/js/datastore/Datastore.ts)

I don't think there's anything specific about Firebase that's exposed past the FirebaseDatastore that would lock us down to Firebase.

It would just require a platform that was event-based, had some sort of auth layer, etc.

In theory one could probably use Elasticsearch with some sort of binary storage layer as well an event distribution framework. But it would be a real pain to setup.

The reason I like Firebase actually has to do with the fact that it's amazingly easy to setup auth as well as the fact that it has a VERY VERY nice event listener framework.

With Firebase you can subscribe to data so if it's changed on the server you get an immediate update and can pull down the latest copy.

It also supports cache-first operation so you can immediately return results if you're offline or don't care that your data might be stale.

It's real time which is something that git lacks. The longer you're out of sync the greater chance you need to merge. With Firebase you're constantly in sync. Even remote machines that are running in the background are sync'd in real time.

Also, the main reason we're not really pushing git sync is mostly due to both ease of use as well as the fact that git sync isn't really a consumer-friendly tech.

## Mass Adoption

The primary goals of Polar are to focus on mass consumer adoption of the collaboration aspects of Polar.

This includes high school students, medical students, researchers, lawyers, etc.  Many of these people have never even *heard* of git.

By consumer I mean just regular people using Polar to collaborate with colleagues.  

I [wrote up another post about it here](https://getpolarized.io/2019/03/01/polar-personal-knowledge-repository.html) and how we view the self hosted and humane technology movements.

Any type of self-hosted strategy means that the user needs to configure software which makes things much more complicated and would slow our growth.

I'm very motivated by the "humane technology" and "self-hosted" movement but my thinking is that this is economic and a byproduct of excessive capitalism not necessarily something inherent in tech or specific to Google/Facebook.

This is the main reason I'm trying to pursue more rapidly adoptable technologies. For Polar to succeed long term I want the community and the technology to be economically viable and to do that I need to have a large user base.

Think of the way the Wikimedia foundation runs.  They have a LARGE number of users.  They then raise money once per year which funds their goals.  

I think it can still be humane. In fact that's why I called it Polar and made it Open Source. I want people to trust that it will never vanish which is why the OSS part of it is very important.



