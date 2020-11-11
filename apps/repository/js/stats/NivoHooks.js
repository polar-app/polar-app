"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNivoTheme = void 0;
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
function useNivoTheme() {
    const theme = useTheme_1.default();
    return {
        markers: {
            textColor: theme.palette.text.primary
        },
        axis: {
            legend: {
                text: {
                    fill: theme.palette.text.primary,
                    color: theme.palette.text.primary
                }
            },
            ticks: {
                text: {
                    fill: theme.palette.text.primary,
                    color: theme.palette.text.primary
                }
            }
        },
        dots: {
            text: {
                fill: theme.palette.text.primary,
                color: theme.palette.text.primary
            }
        },
        legends: {
            text: {
                fill: theme.palette.text.primary,
                color: theme.palette.text.primary
            }
        },
        labels: {
            text: {
                fill: theme.palette.text.primary,
                color: theme.palette.text.primary
            }
        },
        tooltip: {
            container: {
                background: theme.palette.text.primary,
                color: theme.palette.background.default
            }
        }
    };
}
exports.useNivoTheme = useNivoTheme;
//# sourceMappingURL=NivoHooks.js.map