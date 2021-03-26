// site-wide scripts.


/**
 * Simple script to send an event

 */
function sendEvent(category, action) {

    gtag('event', action, {
        'event_category': category
    });

}
