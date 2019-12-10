import {Platforms} from "polar-shared/src/util/Platforms";

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

    public static isPhone(): boolean {
        return this.get() === 'phone';
    }

    public static isDesktop(): boolean {
        return this.get() === 'desktop';
    }

}

export type Device = 'phone' | 'tablet' | 'desktop';
