import {IDimensions} from '../../util/Dimensions';

// declare var window: any;

/** @ElectronRendererContext */
export function configureBrowser(windowDimensions: IDimensions) {

    function defineProperty(target: any, key: string, value: any) {

        console.log(`Defining ${key} as: ${value} on: `, target);

        try {
            Object.defineProperty(target, key, {
                get: () => {
                    return value;
                }
            });
        } catch (e) {
            console.warn(`Unable to define ${key}`, e);
        }

    }

    // noinspection TsLint
    function configureBrowserWindowSize(windowDimensions: IDimensions) {

        console.log("Configuring browser window size...");

        // TODO: see if I have already redefined it.  the second time fails
        // because I can't redefine a property.  I don't think there is a way
        // to find out if it's already defined though.

        const definitions = [
            {key: "width",       value: windowDimensions.width},
            {key: "availWidth",  value: windowDimensions.width},
            {key: "height",      value: windowDimensions.height},
            {key: "availHeight", value: windowDimensions.height}
        ];

        for (const definition of definitions) {
            defineProperty(window.screen, definition.key, definition.value);
        }

        defineProperty(window, 'outerWidth', windowDimensions.width);
        defineProperty(window, 'outerHeight', windowDimensions.height);

    }


    function writeStyles(id: string, cssText: string) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = id;
        styleElement.innerHTML = cssText;
        // FIXME: this is broken right now and we have to compute the right head location
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    function defineMaxHeightStylesheet(rule: string) {

        // TODO: I need to consider if it's not just better to measure the
        // viewport height and replace it myself.  It is probably a bad idea
        // so set this too small and will break in a lot of use cases.

        const cssText = `
        ${rule} {
            max-height: 400px;        
        }
        `;

        writeStyles('polar-vh-max-height', cssText);

    }

    function configureMaxVerticalHeight() {

        console.log("Configuring max vertical height...");

        for (const stylesheet of Array.from(document.styleSheets)) {

            const rules: CSSStyleRule[] = (<any> stylesheet).rules;

            for (const rule of rules) {

                if (rule.style && rule.style.height === '100vh') {
                    console.log("Found 100vh rule to override: ", rule.selectorText);
                    defineMaxHeightStylesheet(rule.selectorText);
                }

            }

        }

    }

    try {

        configureBrowserWindowSize(windowDimensions);
        configureMaxVerticalHeight();

    } catch (e) {
        console.error("Failed to execute script: ", e);
    }

}




