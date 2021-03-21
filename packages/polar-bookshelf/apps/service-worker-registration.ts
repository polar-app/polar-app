

function isElectron() {
    return window && 'process' in window;
}

function isBrowser() {
    return ! isElectron();
}

if ('serviceWorker' in navigator && isBrowser()) {

    let beforeInstallPromptEvent: Event | undefined;

    window.addEventListener('beforeinstallprompt', (event) => {

        beforeInstallPromptEvent = event;

        // TODO: once we have this we need to
        // https://love2dev.com/blog/beforeinstallprompt/

        // Used to trace PWA install so that we know we can install directly.
        // Note that this will NOT fire if the app is already installed.
        console.log("SUCCESS: received beforeinstallprompt and PWA is installable!");

        // TODO: keep a copy of the event so that we can reuse it in the future.

        // TODO: we will probably have to use window messages here to communicate
        // with react I think.

    });

    // webpack-dev-server runs on port 8050...
    const isLocalhost = document.location.host === 'localhost:8050';

    // Delay registration until after the page has loaded, to ensure that our
    // precaching requests don't degrade the first visit experience.
    // See https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/registration
    window.addEventListener('load', function() {

        if (isLocalhost) {
            console.warn("Not registering service worker - localhost/webpack-dev-server");
            return;
        } else {
            console.log("Service worker being registered.");
        }

        async function doAsync() {

            const reg = await navigator.serviceWorker.register('/service-worker.js');

            reg.onupdatefound = () => {

                console.log("Service worker update found");

                // The updatefound event implies that reg.installing is set; see
                // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
                const installingWorker = reg.installing;


                if (installingWorker) {

                    installingWorker.onstatechange = function() {

                        switch (installingWorker.state) {

                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    // At this point, the old content will have been purged and the fresh content will
                                    // have been added to the cache.
                                    // It's the perfect time to display a "New content is available; please refresh."
                                    // message in the page's interface.
                                    console.log('New or updated content is available.');

                                } else {
                                    // At this point, everything has been precached.
                                    // It's the perfect time to display a "Content is cached for offline use." message.
                                    console.log('Content is now available offline!');
                                }
                                break;

                            case 'redundant':
                                console.error('The installing service worker became redundant.');
                                break;
                        }
                    };

                }

            };

        }

        // Your service-worker.js *must* be located at the top-level directory relative to your site.
        // It won't be able to control pages unless it's located at the same level or higher than them.
        // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
        // See https://github.com/slightlyoff/ServiceWorker/issues/468
        doAsync()
            .catch(e => console.error('Error during service worker registration:', e));

    });

}
