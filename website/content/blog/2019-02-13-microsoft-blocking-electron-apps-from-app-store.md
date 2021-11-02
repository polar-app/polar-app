---
title: Microsoft Blocking Electron Apps from the App Store
date: 2019-02-13 06:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/electron-scaled.jpg
description: Microsoft Blocking Electron Apps from the App Store - This rejection really makes me nervous.  Turns out my app is blocked as I'm not using the right web components.   
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/electron-scaled.jpg">

# Microsoft Blocking Electron Apps from the App Store

I've been working hard to port my app over to the MS App Store (and the Apple 
App Store).  

It's an insanely difficult process involving multiple iterations. 

Each time you submit the app they only give you one reason why your app can't be
submitted.

This rejection really makes me nervous.  Turns out my app is blocked as I'm 
not using the right web components.

The only problem is that the ENTIRE application falls into this category!

There's no way I can fix this problem.  I can't just ditch Electron. 

> Because your app browses the web, it must use the Windows Platform HTML and JavaScript engines. You can find information about the platform here:
> 
> Edge Developer Blog: https://blogs.windows.com/msedgedev/2015/08/27/creating-your-own-browser-with-html-and-javascript/
> 
> GitHub Browser Project: https://github.com/MicrosoftEdge/JSBrowser/tree/v1.0
> 
> XAML WebView API: https://msdn.microsoft.com/en-us/library/windows/apps/windows.ui.xaml.controls.webview.aspx

> HTML WebView API: https://msdn.microsoft.com/en-us/library/windows/apps/dn301831.aspx

I'm really hoping this is an error. I've contacted Microsoft about this and
hopefully I hear back in 2-3 days.  The problem is that this little glitch
costs me another week where my app isn't live.

This has to be an error.

They've accepted my app in the past.  An older version that uses Electron was 
accepted and is available for download now.

Either this is a new policy or they messed up by accepting me the first time.

Also, Microsoft itself is working on migrating to Chromium as the browser
component behind Edge. 

Hopefully this is much ado about nothing but not good news to receive first 
thing in the morning. 
