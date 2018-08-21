import {IDimensions} from '../../util/Dimensions';

declare var window: any;

/** @ElectronRendererContext */
export function configureBrowserWindowSize(windowDimensions: IDimensions) {

    // TODO: see if I have already redefined it.  the second time fails
    // because I can't redefine a property.  I don't think there is a way
    // to find out if it's already defined though.

    let definitions = [
        {key: "width",       value: windowDimensions.width},
        {key: "availWidth",  value: windowDimensions.width},
        {key: "height",      value: windowDimensions.height},
        {key: "availHeight", value: windowDimensions.height}
    ];

    definitions.forEach((definition) => {

        console.log(`Defining ${definition.key} as: ${definition.value}`);

        try {
            Object.defineProperty(window.screen, definition.key, {
                get: function () {
                    return definition.value
                }
            });
        } catch(e) {
            console.warn(`Unable to define ${definition.key}`, e);
        }

    });

}
