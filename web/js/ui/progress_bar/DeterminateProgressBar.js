"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeterminateProgressBar = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const ID = 'polar-determinate-progress-bar';
const log = Logger_1.Logger.create();
const FAST_PROGRESS_CUTOFF = 100;
class DeterminateProgressBar {
    static update(value) {
        const progress = typeof value === 'number' ? value : value.progress;
        if (progress === null || progress === undefined || progress < 0 || progress > 100) {
            console.warn("Invalid value: ", progress);
            return;
        }
        if (!(typeof value === 'number')) {
            if (value.duration < FAST_PROGRESS_CUTOFF && progress < 100) {
                return;
            }
        }
        if (progress === 100 && !this.get().isPresent()) {
            return;
        }
        const progressElement = this.getOrCreate();
        progressElement.value = progress;
        if (progress >= 100) {
            this.destroy();
        }
    }
    static destroy() {
        const timeout = 350;
        const doDestroy = () => {
            const progressElement = this.get().getOrUndefined();
            if (progressElement) {
                if (progressElement.parentElement !== null) {
                    progressElement.parentElement.removeChild(progressElement);
                }
                else {
                    log.warn("No parent element for progress bar.");
                }
            }
            else {
            }
        };
        setTimeout(() => {
            const progressElement = this.get();
            if (!progressElement.isPresent() || progressElement.get().value !== 100) {
                return;
            }
            doDestroy();
        }, timeout);
    }
    static getOrCreate() {
        const result = this.get();
        if (result.isPresent()) {
            return result.get();
        }
        return this.create();
    }
    static get() {
        const element = document.getElementById(ID);
        return Optional_1.Optional.of(element);
    }
    static create() {
        const element = document.createElement('progress');
        element.value = 0;
        element.max = 100;
        element.id = ID;
        element.style.height = '4px';
        element.style.width = `100%`;
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '99999999999';
        element.style.borderTop = '0';
        element.style.borderLeft = '0';
        element.style.borderRight = '0';
        element.style.borderBottom = '0';
        element.style.padding = '0';
        element.style.borderRadius = '0';
        element.style.webkitAppearance = 'none';
        document.body.appendChild(element);
        return element;
    }
}
exports.DeterminateProgressBar = DeterminateProgressBar;
//# sourceMappingURL=DeterminateProgressBar.js.map