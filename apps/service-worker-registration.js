"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function isElectron() {
    return window && 'process' in window;
}
function isBrowser() {
    return !isElectron();
}
if ('serviceWorker' in navigator && isBrowser()) {
    let beforeInstallPromptEvent;
    window.addEventListener('beforeinstallprompt', (event) => {
        beforeInstallPromptEvent = event;
        console.log("SUCCESS: received beforeinstallprompt and PWA is installable!");
    });
    const isLocalhost = document.location.host === 'localhost:8050';
    window.addEventListener('load', function () {
        if (isLocalhost) {
            console.warn("Not registering service worker - localhost/webpack-dev-server");
            return;
        }
        else {
            console.log("Service worker being registered.");
        }
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const reg = yield navigator.serviceWorker.register('/service-worker.js');
                reg.onupdatefound = () => {
                    console.log("Service worker update found");
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = function () {
                            switch (installingWorker.state) {
                                case 'installed':
                                    if (navigator.serviceWorker.controller) {
                                        console.log('New or updated content is available.');
                                    }
                                    else {
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
            });
        }
        doAsync()
            .catch(e => console.error('Error during service worker registration:', e));
    });
}
//# sourceMappingURL=service-worker-registration.js.map