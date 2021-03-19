
/**
 *
 * @param scriptSrc function to call if we are in Electron.
 * @param fallbackLoader
 */
function injectApp(scriptSrc, fallbackLoader, forceScript) {

    if (typeof require === 'function' && ! forceScript) {
        console.log("Loading via fallbackLoader");
        fallbackLoader();
    } else {
        console.log("Loading via script: " + scriptSrc);
        injectScript(scriptSrc);
    }

}

function injectScript(src, type) {

    const script = document.createElement('script');
    script.src = src;

    // loading async is ugly but we're going to move to webpack and clean this
    // up eventually.
    script.async = false;
    script.defer = false;

    if (type) {
        script.type = type;
    }

    document.documentElement.appendChild(script);

}
