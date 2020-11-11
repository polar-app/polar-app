"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyResponsivePie = void 0;
const React = __importStar(require("react"));
const pie_1 = require("@nivo/pie");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const data = [
    {
        "id": "python",
        "label": "python",
        "value": 420,
        "color": "hsl(48, 70%, 50%)"
    },
    {
        "id": "php",
        "label": "php",
        "value": 499,
        "color": "hsl(194, 70%, 50%)"
    },
    {
        "id": "elixir",
        "label": "elixir",
        "value": 448,
        "color": "hsl(61, 70%, 50%)"
    },
    {
        "id": "rust",
        "label": "rust",
        "value": 259,
        "color": "hsl(233, 70%, 50%)"
    },
    {
        "id": "hack",
        "label": "hack",
        "value": 141,
        "color": "hsl(229, 70%, 50%)"
    }
];
exports.MyResponsivePie = () => {
    const theme = useTheme_1.default();
    return (React.createElement(pie_1.ResponsivePie, { data: data, margin: { top: 40, right: 80, bottom: 80, left: 80 }, innerRadius: 0.5, padAngle: 0.7, cornerRadius: 3, colors: { scheme: 'nivo' }, borderWidth: 1, borderColor: { from: 'color', modifiers: [['darker', 0.2]] }, radialLabelsSkipAngle: 10, radialLabelsTextXOffset: 6, radialLabelsTextColor: theme.palette.text.secondary, radialLabelsLinkDiagonalLength: 16, radialLabelsLinkHorizontalLength: 24, radialLabelsLinkStrokeWidth: 1, radialLabelsLinkColor: { from: 'color' }, slicesLabelsSkipAngle: 10, slicesLabelsTextColor: theme.palette.text.secondary, animate: true, motionStiffness: 90, motionDamping: 15, defs: [
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ], fill: [
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ], legends: [
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: theme.palette.text.secondary,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: theme.palette.text.secondary
                        }
                    }
                ]
            }
        ] }));
};
//# sourceMappingURL=PieDemo.js.map