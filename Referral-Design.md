# Overview

Basic / first pass implementation of referrals.

# Sharing referral codes

There is a new page at /invite that the user will be shown that they can use to trigger sending a message.

On this page they can:

- paste in a list of emails.  The backend will send then an email with a referral code
    - TODO: this has not yet been implemented on the backend.
- copy the link, with referral code so that the user can send it themselves.
- use the mobile 'send' feature to trigger sending a message when using their mobile device
- send via twitter button (automatically triggers twitter share)
- send via facebook button (automatically triggers facebook share)

In the future we can extend this to support more APIs like accessing their gmail contacts.

# Triggering the referral code on signup

This referral link will:

- load app.getpolarized.io

- save the referral code into the browser

- redirect to a landing page saying that if they signup now they get a free month of polar on top of their existing 
  trial month (2 months)
  
... 30 days later:

- upon signin, if the user has a referral that hasn't been granted (and has aged 30 days and has been active)

    - automatically give both the referrer, and referee, free 30 days of polar by
        - calling the stripe coupon API to give them one month of their current plan
        
# Trials and Rewarding Points

There will be two ways of rewarding points:

- if they are approaching the end of a trial , but they are a referral, we

        
- FIXME: do the grant when their trial is about to expire?  This is probably the best way to do things as we 
  would be within a function ANYWAY and they just get to continue using polar for another 60 days.        
        
- FIXME: I think for TRIAL users with a referral, they should just be given a longer trial, it's easier because capturing
  the credit card at that point, might be harder.      
        
# Messages

- send the referee an email that one of their users has signed up and that they will be given a free month 
  once their referred user has aged for 30 days.
        
- 
        
# Notes

- I think it should always just be 'one month of bronze'.  This way:

    - It's standardized for .edu pricing as well.  If they're 19.95 per month for bronze we just give them a credit
      of $19.95 / 12
          
    - It's standardized across currencies:
        - If they purchase in INR we give them the equivalent of INR bronze at one month. 

    - It's standardized across plans.  If they purchase gold, they won't get a full month of gold for one referral.  They 
      would need 2-3.
    
- We can convert this to points later if we want.  It's just that 10 points would equal "one month bronze" and converted
  to the users currency.

- The reward will be triggered automatically.  Right now this is slightly easier as I don't need to build a points 
  system or a UI to redeem points.  The users are just given the coupon via stripe.  

- We can give them ways to earn points later including by sharing their documents, and flashcards publicly... 

## Trial Plans

- Trials will be triggered via stripe subscription trials.  They will last 30 days and they will not require a credit 
  card

 - https://stripe.com/docs/billing/subscriptions/trials
 
    - use stripe trials for this... it's easy and we only have to implement one endpoint I think.

## TODO

- the referred user basically gets a full month extra in their trial... when they are ready.

- how do we handle granting referrals to new users and handle trials.

    - the main issue is that we would need to capture credit card details and UNTIL they have given us credit card 
      details we're not really certain they are 'converted' users...  

- we do NOT want to automatically grant them at 27 days because they might be idle users... we would have to make
  sure they are really / truly active
  
- write to a 'heartbeat' table?

## Questions

- the initial 30 day trial should not require a CC, what about when the user is given an extension on the trial?

- can I convert trials to paying via stripe checkout?  (I'm finding out now via stripe)

- 
