"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Descriptors = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Reducers_1 = require("polar-shared/src/util/Reducers");
const log = Logger_1.Logger.create();
class Descriptors {
    static calculateDocDimensions(descriptor) {
        let width = 800;
        let minHeight = 1100;
        if (!descriptor) {
            return { width, minHeight };
        }
        if (descriptor.browser) {
            width = descriptor.browser.deviceEmulation.screenSize.width;
            log.info("Setting width from device emulation: " + width);
        }
        const scrollBox = this.computeScrollBox(descriptor);
        if (scrollBox.isPresent() && scrollBox.get().width > width) {
            if (!Preconditions_1.isPresent(scrollBox.get().widthOverflow) ||
                scrollBox.get().widthOverflow === 'visible') {
                width = scrollBox.get().width;
            }
            log.info("Setting width from scroll settings: " + width);
        }
        minHeight = (11 / 8.5) * width;
        return { width, minHeight };
    }
    static computeScrollBox(descriptor) {
        return this.computeScrollBoxFromBoxes(descriptor.scrollBox, descriptor.scroll);
    }
    static computeScrollBoxFromBoxes(scrollBox, scroll) {
        return [Optional_1.Optional.of(scrollBox), Optional_1.Optional.of(scroll)]
            .filter(current => current.isPresent())
            .filter(current => current.map(scrollBox => this.isScrollBox(scrollBox)).getOrElse(false))
            .reduce(Reducers_1.Reducers.FIRST, Optional_1.Optional.empty());
    }
    static isScrollBox(scrollBox) {
        return typeof scrollBox.width === 'number' && typeof scrollBox.height === 'number';
    }
}
exports.Descriptors = Descriptors;
//# sourceMappingURL=Descriptors.js.map