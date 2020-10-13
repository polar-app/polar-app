---
title: Roadmap for Polar in Q1 2020
date: 2020-01-16T08:00:00.000-08:00
layout: post
description: Roadmap for Polar in Q1 2020.  Dark mode, keyboard bindings, and expanding the team.
large_image: https://i.imgur.com/CQYO7T7.png
---

<img class="img-fluid" src="https://i.imgur.com/CQYO7T7.png">

# Roadmap for Polar in Q1 2020

A new year is upon is and I wanted to publish a roadmap of where we're going with Polar in Q1 2020 as well as some small
changes in the project.

## Expanding the Team

First, the most interesting news is that we've expanded the team and [I wanted to introduce Jonathan Graeupner](https://getpolarized.io/2020/01/16/joining-the-team.html).

<img class="img-fluid" src="https://i.imgur.com/sONUWwd.png"/>

<p class="text-center">
<b>Jonathan and Kevin at AWS Loft San Francisco, Jan 2020</b>
</p>

Jonathan received a PhD in Chemistry from Yale at 25 and has been fascinated by mnemonics as a way to accelerate his
learning process.  Jonathan's focus is going to be on growth and product and helping us to really understand our
user base and expand the user base.

To an outsider, focused on the tech aspects of Polar, it might seem more beneficial to hire a React engineer or
someone focused on UI and UX.  However, by far THE most important thing a product needs to do is resonate with users
and of course grow (revenue, number of users, etc).

I've been laser focused on first, confirming that you guys would actually benefit from using a product like Polar, and
then trying to improve usability and market fit.

This is one of the reasons I've been so aggressive about sending off surveys, asking for feedback directly inside the
app, etc.

What's the use of building something faster if you're just building something no one wants!

Having Jonathan come in and focus on this basically allows me to focus more on building the product and scaling the
team.

## Tablets, phones, and handheld devices

We're working on implementing support for both tablet and phones including improving our mobile usability.

Right now we've been able to implement about 95% of the annotation support on handheld devices and about 80% of the
core reading functionality.

The goal is to have both iOS and Android apps that you can install directly from the app store.

Initially, these are going to be usable via webapps (just in your mobile browser) but we're going to port them directly
to the app stores directly.

Android will come first and then 30-90 days later we will have iOS.  Unfortunately, shipping an app in the Apple App
Store is rather difficult and they require us to jump through a ton of hoops that aren't really required in the
Google Play Store.

## Stability

This has been a huge focus of mine and I'm trying to allocate 20% of my time to just fixing basic usability bugs that
pop up from time to time.

Stability is insanely important.  Polar users are really passionate about the project but it's frustrating when you
adopt it into your workflow and small things break from time to time.

To that end we're revamping our testing and continuous integration system to test more scenarios including bringing
on board full webapp testing, platform specific tests including Windows, Linux, and MacOS.

### Improved Offline Reading

This is another area that will benefit from our improved testing framework.  We want to test offline and Chrome supports
simulating both slow networks and being completely offline.

We're going to incorporate this into our testing framework to help prevent regressions where we accidentally break
offline functionality.

## Releases

Now that the holidays are over we want to bump our our release cadence and push new versions every 1-2 weeks.

Right now we update the webapp 2-3x per week but try to only release 1x per week max four our Desktop app.  We don't
want constant updates to interrupt your workflow.

## Dark Mode

This has been a major background task and we're making progress on implementing dark mode.  The major blockers
right now are mostly around PDFJS not properly supporting changing text colors but we have an important fix in
progress.

## Citation Management

This is another big feature set we're working on.  Improved citation management should mean Polar users can partially
manage bibliography as well as extended metadata for the documents they import.

This includes features like DOI lookup, searching for PDFs by title, DOI, and storing the extended metadata within Polar
directly.

## Key Bindings

This is right up there with dark mode but supporting extended key bindings is important for desktop and Linux users.

We're working on adopting a new react library to make key bindings much easier.

## Automatic Pagemarks

New users to Polar seem to get confused about the fact that pagemarks (right now) are manual.

We're going to add a new "auto pagemark" feature that creates pagemarks automatically while you scroll.

## Two Column Pagemarks

Somewhat related to auto pagemarks but another main issue is supporting pagemarks while there are multiple columns.

This is going to be resolved as well with a new 'two column' mode to allow the user to tell us that the PDF they're
working with is two columns to allow smarter pagemark placement.

## Improved Anki support

Big one!  We're definitely going to be improving our Anki support.  Some important features that are queued up include:

 - Do a better job at preventing cards that are invalid in Anki and yield sync errors
 - Add new models so that we can include Polar-specific metadata to Anki including context, book metadata, images
   of the area highlights, the original text highlight that it was attached to, etc.
 - Fixing small bugs like excess tags within Anki.

## Feedback

Keep the feedback coming!  If you guys have any issues with Polar feel free to reach out as we're very good
at rapid iteration and fixing issues found by our users!
