import {Platforms} from "./Platforms";

export class Devices {

    public static get(): Device {

        if (Platforms.isDesktop()) {
            return 'desktop';
        }

        if (window.screen.width < 700) {
            // it's not a desktop, so it must be a phone.
            return 'phone';
        } else {
            return 'tablet';
        }

    }

}

export type Device = 'phone' | 'tablet' | 'desktop';
