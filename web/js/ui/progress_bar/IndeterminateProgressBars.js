"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndeterminateProgressBars = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const ID = 'polar-progress-bar';
const log = Logger_1.Logger.create();
class IndeterminateProgressBars {
    destroy() {
        const progressElement = IndeterminateProgressBars.getProgressElement().getOrUndefined();
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
    }
    static getProgressElement() {
        const element = document.getElementById(ID);
        return Optional_1.Optional.of(element);
    }
    static create() {
        const current = this.getProgressElement();
        if (current.isPresent()) {
            return new IndeterminateProgressBars();
        }
        const element = document.createElement('div');
        element.setAttribute('class', 'progress-indeterminate-slider');
        element.innerHTML = `
            <div class="progress-indeterminate-line"></div>
            <div class="progress-indeterminate-subline progress-indeterminate-inc"></div>
            <div class="progress-indeterminate-subline progress-indeterminate-dec"></div>
        `;
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
        document.body.appendChild(element);
        return new IndeterminateProgressBars();
    }
}
exports.IndeterminateProgressBars = IndeterminateProgressBars;
//# sourceMappingURL=IndeterminateProgressBars.js.map