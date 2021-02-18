---
title: Electron (or Github) Banned Me for Falsely Violating their Code of Conduct.
date: 2019-01-23 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/electron.png
description: 
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/electron.png">

# Electron (or Github) Banned Me for Falsely Violating their Code of Conduct. 

An Electron developer (or Github) has kicked me off the project for making what
he feels were 'snide' comments about Electron.

My comments were not snide but were expressing concern and I believe the ban was
unfair and undemocratic.

To be as cordial as possible I won't mention his name on this blog post.  I
don't want to get him in trouble with his employer or the Electron project.

I honestly feel this whole issue is much ado about nothing - a combination of a
bad assumption along with a bad policy for handling conduct within the Electron
community.

However, his response here **is** a legitimate problem which we need to talk
about.

The reason I'm publishing it here is not to attack the Electron community or
Github.  I just think this needs to be fixed.  This is a situation where the
cure is worse than the disease.

This process just seems broken and fundamentally undemocratic.

Additionally, I don't feel comfortable now posting in the Electron community
seeing as I don't understand the process and don't want to get a continued
ban.

To make matters worse this was from a Github staff member.  I'm not actually
100% certain that this is from the Electron project and not Github directly.

## Background

Electron is a framework for building native desktop apps using web browser
technology.

[Polar](https://getpolarized.io/) uses it internally for building our app, rendering PDFs and web content
and generally provides about 80% of the framework for our application.

Polar is a [document management platform](https://getpolarized.io/) that
supports capturing and annotating PDF and web content.  Electron is perfect
because we can work with documents in their native web format but also do so on
the desktop so we get the benefits of both worlds.

Imagine a web browser + web server all in one framework and running on your
desktop!  Yeah.  Super cool!

## Trouble in Paradise

Early this week I made a comment about a bug in Electron that was very
concerning for me and the Polar project.

It basically kills our app and if I can't find a workaround we're going to be
stuck on Electron 3.0 for the foreseeable future.

This is actually worse than it sounds as many libraries only work on the
evergreen version of browsers so it also limits our ability to upgrade
dependencies.

Here's what started this whole issue:

> This is a pretty severe regression on 4.0... a main API should not simply stop
working and it shouldn't take weeks to resolve.

> Is this API not tested? How did the 4.0 release even happen?

> It makes it hard to commit to Electron when major platform APIs simply don't
work.

This is my comment verbatim.  You're going to have to trust me that I didn't
take anything out of context.  I'm not linking to the comment directly to avoid
causing any trouble with this developer and his employer.

You're welcome to do a Google search for that and I'm sure you'll find my comment
but I ask that you don't reach out in an official capacity to his employer.

My main goal with this comment was to express concern and urgency.  Certainly
not to attack anyone.

However, I do realize that some people may have a "glass half empty" view that
may cloud their judgement.

For example, If you make a genuine statement like "Great job" someone might
accidentally interpret it as being sarcastic.

True story. I literally had one of the engineers I was managing get upset about
an email with the same content.  I had to smooth it out with him the next
morning and explain that I was being sincere and really *did* think that he did
a great job.

With those lessons in hand I usually preface my commentary with a few niceties
to help make it clear that I'm not trying to attack anyone.

I think I first read about this in Dale Carnegie's book 
<a href="https://en.wikipedia.org/wiki/How_to_Win_Friends_and_Influence_People">How
to Win Friends and Influence People</a>.

I fully accept responsibility for not blunting this comment to make it clear
that I was trying to be constructive (I think I was walking out the door at the
time).

However, I also think it's fair to assume that people will give you the benefit
of the doubt most of the time and that my comments woulnd't be unfairly
interpreted as being negative.

## Initial Ban

My comment triggered the following reply:

> Hi @burtonator. We need to have a talk about your approach to the project, and people working on Electron.

> Open source is tricky, and I understand that relying heavily on a project like Electron can be scary, frustrating, and confusing. We do not want to break anyones apps. None of the maintainers want that. We even run a program to help ensure we fix participating app's major issues during our beta cycle.

> Despite that, the issue track is not a place for snide, snark, and comments belittling folks working to maintain a gigantic project.

> Moving forward, I would recommend reading and following the advice in Creators, contributors, and collaborators.

> Just so we're clear, you are welcome to continue participating in the following ways:

> submitting bug reports with enough detail to reproduce - ideally a Fiddle example

> a new feature request with context

> logistical questions that may not be covered in the docs (e.g. asking about release timelines in a polite way)

> Including additional comments such as "How did the 4.0 release even happen" or "The devs NEED to take this seriously" are off-topic and will result in those issues being closed immediately.

> Please follow the next step exactly

> Let's all take a moment to digest the above. Please do not interact with the project for 24-hours. No comments, new issues, or pull-requests. After that, please look through your open issues and edit them to ensure they're entirely on-topic, and we can continue the discussion here about the best way to engage going forward.

## My response

Since I felt this was a huge misunderstanding I posted the following reply to clarify things and try to move forward.

> I think there's a misunderstanding here.

> I always treat people with respect - the way I would expect to be treated.

> There was no snide or underhanded comment on my part here and certainly not my intention at all.

> I usually go out of my way to clarify my intentions just so that my thoughts are clear. In fact I think in another bug on the issue I literally went out of my way to thank the devs for all the hard work.

> I just re-read my post and while my issue raised concern I don't think it goes anywhere near being snide or expressing any negative tone.

> I also asked a few people on my end what their thoughts were and they agreed.

> My tone was one of urgency and concern.

> Also, these issues tend to be very subjective. For example how can you objectively say that something is snide? How can I falsify it and say it is not snide?

> How can I express that a bug is deeply concerning to me and that it seriously negatively impacts my project without using those worse?

> Again. Wanted to make it clear that I appreciate ALL the hard work from the Electron team.

> As an external user of the APIs I'm trying to express severe concern in a platform regression and not sure how to do that without actually raising that concern.

This comment was then buried and marked as 'off-topic' - preventing me from
replying to someone publicly criticizing me in an open forum.

## Week Ban

This ended up triggering a 1 week ban:

> Hey **redacted**, I enjoyed the chance to step back from this issue, but it looks like there was a misunderstanding about your next step. No worries, that's why pencils have erasers.

> We're going to try this again.

> I'm asking everyone step back and withdraw from this issue, and others you have posted for the next 7 days. We won't close anything, and you won't post any followup comments, PRs, etc.

> We can use that time to reflect on how everyone really just wants open source to work, and come back with a fresh perspective.

> In order to avoid ambiguity or futher miscommunications, I want to make it clear that this is not a suggestion. This is your and everyone elses duty to continue participation in the Electron community.

Yes.  Because I wanted to clear the air and help clarify the situation, in good
faith, I was then punished with a subsequent one week ban.

## Key API Breakage

One of the concerns I have here is that this is a core API that's broken.

This isn't a bug that happens 5% of the time or on some edge condition.  The API
simply does not work and Electron 4.0 was shipped in a broken state.

Part of my inquiry was *how* did this happen as the code is tested.

Now to help prevent this, Electron started a beta program for apps to submit so
that if main APIs break that they could surface the breakage to the project
before an official release was done.

We applied to this program and weren't accepted.

To be clear we weren't upset about this in anyway. Honestly I assumed that we
were either too small for Electron (smaller user base) or they already had
enough members of the beta program.

This leaves us with a huge hole where we have no way to report critical issues.

This is certainly part of my urgency of tone in my comment. However, I think
that this was completely within the bounds of normal community discourse.

## Broken Code of Conduct

I couldn't find any documentation from the Electron project about their process
for resolution or handling project disputes.

No mention of any bans. No mentions of any timeout periods, etc.

If I legitimately missed something please let me know.

The closest thing I could find was the 
<a href="https://github.com/electron/electron/blob/master/CODE_OF_CONDUCT.md">Electron
Code of Conduct</a> which doesn't document this process whatsoever.

I do actually agree with a great deal of what's expressed in this here.  I've
always believed that people should be judged by the content of their character
and believe that MLK was absolutely correct in this regard.

However, there are major issues with what's happened when resolving this
situation.

### No Private Disclosure

I was accused of inappropriate behavior in a public forum. There was no
attempt to reach out for clarification, address any issues privately, or allow
me the option to retract my comments or reformat them so that they were more
cordial.

Remember, I was publicly accused of inappropriate behavior.  My customers,
investors, future employees (and employers) can see this post.

My reply trying to be cordial and resolve the situation as a misunderstanding
was marked off topic and hidden.

### No Ability to Defend Myself

I was robbed of the ability to defend myself by having my comment hidden/buried.

This should have effectively resolved the issue but I was punished with a week
ban for trying to move forward constructively.

### Guilty until proven innocent.

I was first given a timeout / punishment 'banning' me from not interacting
with the community for 24 hours.

I reached out with good intentions to post a comment explaining that I felt this
was a miscommunication only to further punished for an additional 7 days.

Note that my reply was not a violation of any policy.  I was asked to *please*
not interact with the project for 24 hours.  My thinking was that since it was a
suggestion, and that I felt that the whole thing was a misunderstanding, that
posting a comment *explaining* my position would resolve the issue.

This is very problematic.

There is no due process here. I have no right to confront my accuser, no
ability to plead not-guilty, no appeal process, no documentation about how this
even works.

In short, this is inherently undemocratic.

I'm simply immediately found guilty, publicly punished, kicked off the project,
and if I reply to defend myself I'm kicked off for another week.

Now I will agree that getting kicked off a project for a week isn't the end
of the world but the code of conduct exists to make members of the project
feel welcomed.

This does not make me feel welcome!

In fact, I'm worried that this will happen again.

The comment I posted was in my normal style of communication.  I have never had
anyone call me out for such commentary and I've been an Open Source contributor
for more than 20 years.

### Open Questions

- Who made this decision to ban me?  Was it the contributor himself?  Was this
made on behalf of the Electron project? Was this made by Github?

- Can I ban someone from Electron if *I* don't like their comments?  Where do
I submit my complaints?  How can I view the complaints about me directly?

- How do we combat subjective judgement of comments? What if I felt something
was snide or sarcastic?  Can I ban someone from the Electron project?  Who has
these special permissions to ban people?

#### From Github or Electron?

Are these statements from Github or from Electron?  I think they're from the
Electron project but I'm honestly a bit confused as the contributor also works
for Github and his account is labeled "staff".  Again I'm not trying to get him
in trouble with his employer but I am legitimately confused.

I think this problem is further compounded by the fact that I can't find any
reference to this policy in the Electron project.

I think I feel 70% confident that this is coming from the Electron project
but again I'm not sure.

However, I can't risk that 30% uncertainty around Github. I depend on Github for
work and my career and it would have dramatic and negative implications for my
customers if my account were banned.

## Github and Electron

I don't know what the relationship here is between Github and Electron for this
ban however I want to make it clear that I very very much appreciate Github's
contributions to the Electron community.

I'm simply confused as to what's happening here and want to have some amicable
resolution and to also express my concerns so we can all benefit and move on.

## Recommendations

I think that this entire thing can be resolved easily:

1. Never make negative public assertions against a community member.  Give them
a chance to retract their comments by privately reaching out to them first.
Assuming the best about someone is a good first step towards a positive
resolution.  Also, give them the benefit of the doubt!  It goes a long way
towards resolving issues.

2. There needs to be some mechanism to resolve issues of subjectivity.  There
is no objective measure for the level of 'snideness' of a comment. If you ban
me by saying my comment is 'snide' I have no ability to falsify that statement.
That's definitely not fair.

3. Don't make the ban immediate.  Have some mechanism where someone is given a
heads up before this becomes an issues.  Even just a warning would help.

4. Don't bury my replies.  My reply trying to clarify my position was buried as
off-topic and not actually shown to anyone.  Honestly, I think I have the right
to respond publicly to a comment calling me out for bad behavior. Especially,
when I'm trying to clarify that this was just a miscommunication and try to move
forward on good terms.  Censoring me in this regard just removes my ability to
defend myself and makes it look to outsiders that I'm overly negative.

5. Bias.  Electron developers have an inherent bias here. Instituting their own
ban is like a judge ruling in a case in which he's directly impacted. Electron
developers should have no part in banning Electron contributors.  A neutral 3rd
party should be involved.

Part of the problem here is that the Electron project has better things to do
than work on issues of policy like this. I'd rather have the project focused on
things that are more enjoyable and productive.

I'll be the first to admit that a perfect solution here is difficult to
implement.  I propose just instituting some sort of private warning system first
to give the developer a heads up that people are upset by their comments.

However, this policy is broken and actually contributing to the problem.

If this would have been a friendly reply commenting that my response seemed
overly harsh I would have immediately clarified my position and reformatted my
comment.

It's just more efficient - antagonizing people and offending them works against
what you're trying to accomplish.  This is why I always format emails and
comments in a way that's overly positive.

## Conclusion

I think this whole thing was just a silly mistake and would prefer to just
put the whole thing behind me and continue contributing to Electron.

However, this opens up legitimate flaws with the Electron code of conduct which
essentially devolve into making contributors feel unwelcome when ambiguity
arises.

OK, Electron project. Let's put this behind us. I have to get back to work
fixing that bug ;) 

