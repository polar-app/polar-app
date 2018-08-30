
# How do I enable advanced logging?

Create a file in your ```.polar/config``` directory named ```logging.json``` 
with the following content:

```json
{
  "level": "DEBUG",
  "target": "CONSOLE"
} 
```

By default we use logging level WARN to improve performance and also so it does
not log pointless messages to the console which would just be confusing to an
end user.

The available log levels are:

```text
DEBUG
VERBOSE
INFO
WARN
ERROR
```

We currently only support a log target of ```CONSOLE``` due to performance reasons.

There IS an on-disk version enabled but it usually ends up locking up Electron
essentially defeating the point.  

We plan on implementing a logger implemented on Websockets in the future.

# Aren't Electron Apps Bloated?

## RAM

A default install of Polar uses about 350MB of RAM after a fresh start.

As of 2018 this is about $5 worth of RAM.

Electron and web apps provide for an amazingly powerful development platform.

Without PDF.js, React, Node, and other frameworks, it would be prohibitively 
expensive to re-implement Polar (and not very fun either).

Now add the cost of porting to Windows, Linux, MacOS, Android and iOS.  

You're asking to spend hundreds of thousands of dollars hiring a developer to 
save $5 on RAM.

It's just not a very practical solution.

I'd like to get memory consumption down. It's possible that there are some 
features we can remove but right now it's not a priority.

Just spend the extra $5...
 
## Disk 

The binary download is only 100MB. Fairly reasonable for modern apps.
