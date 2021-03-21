- the timeout for cloud functions is 9 minutes.  I think that's MORE than enough
  for 99% of the documents I want to support.
  
- The task/queue support in google cloud just has a message and an endpoint 
  where it does a post so I think I can just use that.


I'm not sure what the difference is here vs using a cloud function.  I think 
a cloud function has a timeout.  PLUS I can't have a fixed number of workers
and scale it up over time.

    - Yes.  Cloud functions timeout after 1 minute and be extended up to 9 minutes

- what's this system to be called?

    - Metadata Calculation?
    - metacalc
    
    - 

............

I just went through this myself for video encoding jobs that can take up to a
few hours.

I evaluated a bunch of options including Kubernetes and ultimately decided on
Cloud Tasks Queues and App Engine Standard, using basic scaling. This basically
gives me backend code that can take up to 24 hours to run and automatically
scales up on demand and scales down to 0 when not being used.

There are three parts to this:

1) The worker

The worker is where the actual work is executed.

I decided to use App Engine since its super simple to setup and has scaling
built in. The alternatives to App Engine is where I spent a bunch of time
debating. Do I user Kubernetes, manage a scaling VM cluster myself, etc? In the
end, I realized that AppEngine was the best option for my simple kind of job.
Something more complex may not work in App Engine Standard and you'll need a
more complex solution.

If you use App Engine Standard, the scaling is allowed to scale down to 0
instances, so you're not being charged when no work is being done. App Engine
Flexible is more flexible, but scales down to a minimum of 1 so you're always
getting charged.

You have two difference non-manual scaling options. Automatic and Basic.
Automatic gives you more control over how the app scales, but you only get 60
seconds to process requests. If you choose Basic, the app auto-scales on it's
own, but you get 24 hours to handle a request.

By choosing App Engine Standard, you get the ability to scale down to 0. By
choosing Basic Scaling, you get the ability to have a task run for up to 24
hours.

You can write your AppEngine app in a bunch of languages and it's pretty darn
trivial to run in App Engine. Your worker will just be an HTTP endpoint in the
app.

2) The task queue

The task queue is what feeds the worker. I used Cloud Task Queues. This is a
standard message queue.

You can publish tasks from anywhere. The task includes a message, which is just
a string, so it could be JSON, a database id, or whatever. It also includes the
URL of endpoint to be hit. This endpoint is the worker you created. The worker
is given the message and processes it.

So basically, whenever you publish a task to this queue, the App Engine worker
will spin up do the work.

3) A publisher

This is where you publish to Cloud Tasks. I simply publish from a Firebase
function.

---

So in the end, I ended up with exactly with what you're talking about. I trigger
a Firebase function to do the work. The function writes to Firestore where I
track the job and publishes to Cloud Tasks. Cloud Tasks triggers my App Engine
app, which spins up a new instance if needed. The App Engine worker reads from
Firestore and writes incremental progress back so I can keep track of job
progress in my app.
