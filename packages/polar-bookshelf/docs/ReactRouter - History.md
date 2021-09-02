*React Router - History*

Push behavior ( history.push() ): 

We use this method for the following components and cases:

1. Opening add document dialog (history.push({hash: '$add'}))
2. Open a context menu
3. Open the SideNav
4. Switch between tabs

Why do we use the push ability for these cases?

Because we are trying to mimic the andriod app (instead of using React Native), so when we press the back button for example, we would not close the app (as it would be if we didn't change the url) but would simply go back to the previous window/ cancel the operation.


Replace behavior ( history.repalce() ):

In this case, we would not push anything to the stack and it would remain with the same length, but the last element (url) in the stack would be replace with a new one.