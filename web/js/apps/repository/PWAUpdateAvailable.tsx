import React from 'react';
import {Workbox} from 'workbox-window';
import { AppRuntime } from 'polar-shared/src/util/AppRuntime';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/lifecycle";

export const PWAUpdateAvailable = () => {

    const appRuntime = AppRuntime.get();

    if (appRuntime !== 'browser') {
        return;
    }

    useComponentDidMount(() => {

        if ('serviceWorker' in navigator) {

        }
            const wb = new Workbox('/sw.js');
            let registration;

            const showSkipWaitingPrompt = (event) => {
                // `event.wasWaitingBeforeRegister` will be false if this is
                // the first time the updated service worker is waiting.
                // When `event.wasWaitingBeforeRegister` is true, a previously
                // updated service worker is still waiting.
                // You may want to customize the UI prompt accordingly.

                // Assumes your app has some sort of prompt UI element
                // that a user can either accept or reject.
                const prompt = createUIPrompt({
                                                  onAccept: async () => {
                                                      // Assuming the user accepted the update, set up a listener
                                                      // that will reload the page as soon as the previously waiting
                                                      // service worker has taken control.
                                                      wb.addEventListener('controlling', (event) => {
                                                          window.location.reload();
                                                      });

                                                      if (registration && registration.waiting) {
                                                          // Send a message to the waiting service worker,
                                                          // instructing it to activate.
                                                          // Note: for this to work, you have to add a message
                                                          // listener in your service worker. See below.
                                                          messageSW(registration.waiting, {type: 'SKIP_WAITING'});
                                                      }
                                                  },

                                                  onReject: () => {
                                                      prompt.dismiss();
                                                  }
                                              }

                // Add an event listener to detect when the registered
                // service worker has installed but is waiting to activate.
                wb.addEventListener('waiting', showSkipWaitingPrompt);
                wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

                registration = await wb.register();

    });

    // useComponentWillUnmount(

}
