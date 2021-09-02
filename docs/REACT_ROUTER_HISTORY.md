# Overview

Mobile (phone and tablet) apps need to support a back button on Android (and the
web) and we need a proper way to handle the stack of inverting actions and
properly handling exiting the application on Android.

The general behavior is that an app will push an entry on the history stack when 
performing actions that can be inverted.

Like a context menu popping up should push into that stack so that if the user
hits the back button then the context menu vanishes.

Android wouldn't exit the app then but only when we get to the root of the history.

# Main navigation paths.

For main parts of the apps we're using paths so for example / for the home page
or /annotations for annotations.

# Secondary navigation

For dialogs or changing the state of a specific page we're using hash paths like
#sidebar to popup the sidebar or or #add to bring up the add file dialog.

# React Router push

Push behavior ( history.push() ): 

We use this method for the following components and cases:

1. Opening add document dialog (history.push({hash: '$add'}))
2. Open a context menu
3. Open the SideNav
4. Switch between tabs

Why do we use the push ability for these cases?

Because we are trying to mimic the andriod app (instead of using React Native),
so when we press the back button for example, we would not close the app (as it
would be if we didn't change the url) but would simply go back to the previous
window/ cancel the operation.

# Replace behavior ( history.replace() ):

In this case, we would not push anything to the stack and it would remain with the same length, but the last element (url) in the stack would be replace with a new one.
