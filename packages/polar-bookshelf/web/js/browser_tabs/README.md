# 

## BrowserTabsHost

Component that hosts all the tabs.  We give it a default tab and it presents
that...

    - there are really only TWO types of 
    
## TODO:

- how do we deal with the top most level page?  Should everything under it just
  be an iframe?  The upside to an iframe is that there is no risk of CSS and 
  javascript issues becoming a problem but the downside is that we need to have
  the app initialize again and that's not amazingly fast... 
  
    - but perhaps we should just make it fast... 
    
    - this also means we're going to have less CSS issues to deal with
    
    - we might want to enable webview as this is a BETTER control than an iframe
    
    - this would also enable us to handle 'reload' properly ... 
    
        - but webview might be better... 
        
        - but webview won't work in android apps!!!

    - PersistentRoute would make it fast as fuck but we'd need a way to either
      push down the EXACT / new component to render OR use router under it... 
      
  - I think I should just use ReactRouter here and then PersistentRoute inside 
    and then have useNavigation inside it... the main problem, I think, is that
    I might have to use history API directly ... instead of the router because
    the router is context sensitive.  
    
        - also, what about history within a specific tab? how do we want to 
          preserve or restore that?
          
            - what I could do is lift the history/restore the history for 
              each tab on switch?  
              
  - I could use <webview> in ReactNative to but that would mean building my own 
    host there too... 
    
  - we're going to need a 'back' button and something bound to 'back' if we're
    going to make extensive use of this behavior in the webapp - but right now
    I don't think we are
        - I also don't think we can do a bulk restore of the history API
        - instead of using the GLOBAL history API, I could have each tab listen
          to the history API and maintain its own state so back/forward would be
          tab specific... 
          
    - the whole system would be super fragile though... while it would be fast
      I'd have to be careful with routers and handling URLs and key bindings as
      keys on one URL would/could impact another URL - though it would be fast
      
  - the URL *would* have to change because the doc viewer would have to load 
    and parse the component... 
       
       - or I could put the tab host UNDER the router... and then the router
         handles the content dispatch... 
         
       - how would the stores work?  I guess they WOULD change ...
       
       - and YES.. the tab control host should go under the second router so that
         the login screen/etc aren't impacted... and when we redirect to /login
         the tabs go away
         
         ... 
         
       - could I use ANOTHER router to determine which tab to select???   

    - FIXME when I restore the tab, I have to restore the URL and the router 
      should work...  
      
    - I might NOT want to do a PersistentRoute hack and instead just NOT show 
      the children content if that route isn't active... 
      
        AND this means that I'm just switching the URL under it... 
        
        NO ... allow it to be renedered... but display:none it so that we can 
        swap easily... 
        
        
    - FIXME the way we need to do this moving forward is to pass the component 
      to the tab, and then specifyc the docID manually, then we do NOT render 
      a page for /doc in desktop app... and we only render them via the 
      component
    

    - We whuld have the following
    
        DocViewerRoutes
        RepositoryRoutes
        
        ... then DocViewerRoutes needs to be setup only for web.. nothing else
        
        Another strategy is to have the BrowserTabs system be its own router 
        where the /doc URLs are handled as new / dedicated tabs with a "tab 
        router" created for each


    - I have to have a high level TabRouter that:
        - only works when it's activated
        - does .replace() in navigation 
        - allows the other routes to not be activated/ updated until they are
          reactivated when the tab is restored
          
        - 
        
    - I need a isActive function to determine if the current tab, is the current
      screen is on the active screen otherwise the DocViewer key bindings 
      (and the doc/annotation repo bindings) might be enabled.
      
        this only applies to the PersistentRoute issues... and I really only 
        a isPersistentRouteActive() method now 
        
        - this won't really work well because what about key bindings that are 
          in effect for flashcard review or /stats 
          
            
    - ANOTHER big / fatal flaw... the PDF viewer assumes that it's the only app
      and we have things like document.getElementByID and querySelector(.page .canvas)[2]
      
        - this completely breaks the app             
        
        - I can fix this by:
        
            - using React context to determine which PDF I'm working with
            - NOT using documents with IDs and just using classes
            - updating the PDF.js CSS
            
            
    - ObservableStore.tsx is our main issue now. The problem is that the 
      callbacksFactory is being called each time, which is basically a hook, 
      but it's being reloaded each time for some reason... 
      
        - maybe I have to React.useMemo on it??? 

    - if we used webview or iframe then we'd get multi-core loading which would
      be better AND we'd have less issues with react complexity, etc.  
      
        - BUT if I had a fast app then mulit-core wouldn't be an issue. 


    - REMAINING ISSUES:
        - the second PDF viewer fails... might have to do with using an 'id'
        - cant useHistory without things becoming unbearably slow
        - reload won't reload all the tabs.
        - we will need key bindings, context menus, and close
            - MUI might be draggable
        - the CSS is not that pretty but that's obvious
