/**
 * Compute the platform and then set a document attribute so CSS selectors will work.
 * We use this for platform fonts and other settings.
 *
 * There will be an attribute like data-platform-macos or data-platform-android.
 *
 * https://css-tricks.com/os-specific-fonts-css/
 * https://www.simicart.com/blog/pwa-design-ui/
 */
import {Platforms} from "polar-shared/src/util/Platforms";

export class PlatformStyles {

    public static assign() {

        const platform = Platforms.get();
        const platformSymbol = Platforms.toSymbol(platform);

        const targetElement = document.documentElement;
        targetElement.setAttribute('data-platform', platformSymbol.toLowerCase());

    }

}
