---
title: Polar Outage- Sept 18 2019 
date: 2019-09-18 08:00:00 -0800
layout: post
image: https://getpolarized.io/assets/logo/icon.png
description: We had an outage last night for Polar cloud sync and our web application which was related to an issue in Google cloud.  
---

# Polar Outage- Sept 18 2019 

We had an outage last night for Polar cloud sync and our web application which was related to an issue in Google cloud.  

Users would have been unable to use the web application and cloud sync wouldn't work properly.

At 2 AM PST Google downgraded all of our accounts due to "activity":

We received an email with:

"Billing was disabled for your project, or The billing account attached to your project was closed"

All of our accounts were downgraded to the Spark plan (their lowest plan).

Once we figured out what was happening we reverted our billing to blaze (the proper plan) and about ten minutes 
later everything was functioning properly.

This also coincided with a release which was just a coincidence.  Some of our users were saying that Polar was failing
after upgrading but it was just a timing issue.  Upon restart Polar does a full re-sync.

We apologize or the inconvenience.  

We're still trying to investigate *why* this happened as there were no changes on our end and Google shouldn't have
taken our projects offline.
