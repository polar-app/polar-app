"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkModeScrollbars = void 0;
var DarkModeScrollbars;
(function (DarkModeScrollbars) {
    function createCSSForReact() {
        return {
            '*::-webkit-scrollbar': {
                width: '12px'
            },
            '*::-webkit-scrollbar-track': {
                backgroundColor: 'rgb(73, 73, 73)'
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgb(111, 111, 111)',
                borderRadius: '10px',
                border: 'solid 2px rgb(73, 73, 73)'
            },
        };
    }
    DarkModeScrollbars.createCSSForReact = createCSSForReact;
    function createCSS() {
        return {
            '*::-webkit-scrollbar': {
                width: '12px'
            },
            '*::-webkit-scrollbar-track': {
                'background-color': 'rgb(73, 73, 73)'
            },
            '*::-webkit-scrollbar-thumb': {
                'background-color': 'rgb(111, 111, 111)',
                'border-radius': '10px',
                'border': 'solid 2px rgb(73, 73, 73)'
            },
        };
    }
    DarkModeScrollbars.createCSS = createCSS;
})(DarkModeScrollbars = exports.DarkModeScrollbars || (exports.DarkModeScrollbars = {}));
//# sourceMappingURL=DarkModeScrollbars.js.map