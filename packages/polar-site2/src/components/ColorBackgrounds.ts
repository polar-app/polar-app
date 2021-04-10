import {RGBStr} from "polar-shared/src/metadata/HighlightColor";
import {Base64} from "polar-shared/src/util/Base64";

export interface CreateSVGOpts {
    readonly color0: RGBStr;
    readonly color1: RGBStr;
    readonly color2: RGBStr;
    readonly color3: RGBStr;
}

export class ColorBackgrounds {

    public static createBackground(opts: CreateSVGOpts) {
        const dataURL = this.createDataURL(opts);
        return `url('${dataURL}')`;
    }

    public static createDataURL(opts: CreateSVGOpts) {
        return 'data:image/svg+xml;charset=utf-8;base64,' + Base64.encode(this.createSVG(opts));
    }

    public static createSVG(opts: CreateSVGOpts) {

        const {color0, color1, color2, color3} = opts;

        return `<?xml version="1.0"?>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 3000" preserveAspectRatio="xMidYMid slice" class="flex-shrink-0" style="min-width:100%;min-height:100%;filter:saturate(150%);-webkit-filter:saturate(150%)">
    <defs><style>
        #bg {fill:${color0}}
        .rect0 {fill:url(#rg0)}.rect1 {fill:url(#rg1)}.rect2 {fill:url(#rg2)}.rect3 {fill:url(#rg3)}
    </style>
        <radialGradient id="rg0" fx="0.3751760474772716" fy="0.5">
            <stop offset="0%" stop-color="${color0}"></stop>
            <stop offset="100%" stop-color="${color0}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg0" fx="0.33272924574529106" fy="0.5">
            <stop offset="0%" stop-color="${color0}"></stop>
            <stop offset="100%" stop-color="${color0}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg0" fx="0.34546958095681335" fy="0.5">
            <stop offset="0%" stop-color="${color0}"></stop>
            <stop offset="100%" stop-color="${color0}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg1" fx="0.37333092224247755" fy="0.5">
            <stop offset="0%" stop-color="${color1}"></stop>
            <stop offset="100%" stop-color="${color1}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg1" fx="0.3687776267438805" fy="0.5">
            <stop offset="0%" stop-color="${color1}"></stop>
            <stop offset="100%" stop-color="${color1}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg1" fx="0.3081324234360309" fy="0.5">
            <stop offset="0%" stop-color="${color1}"></stop>
            <stop offset="100%" stop-color="${color1}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg2" fx="0.3017124608453101" fy="0.5">
            <stop offset="0%" stop-color="${color2}"></stop>
            <stop offset="100%" stop-color="${color2}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg2" fx="0.3932091950523435" fy="0.5">
            <stop offset="0%" stop-color="${color2}"></stop>
            <stop offset="100%" stop-color="${color2}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg2" fx="0.3607406549856699" fy="0.5">
            <stop offset="0%" stop-color="${color2}"></stop>
            <stop offset="100%" stop-color="${color2}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg3" fx="0.3602315179919998" fy="0.5">
            <stop offset="0%" stop-color="${color3}"></stop>
            <stop offset="100%" stop-color="${color3}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg3" fx="0.38564178768749435" fy="0.5">
            <stop offset="0%" stop-color="${color3}"></stop>
            <stop offset="100%" stop-color="${color3}" stop-opacity="0"></stop>
        </radialGradient><radialGradient id="rg3" fx="0.33633905779723455" fy="0.5">
            <stop offset="0%" stop-color="${color3}"></stop>
            <stop offset="100%" stop-color="${color3}" stop-opacity="0"></stop>
        </radialGradient></defs>
    <rect id="bg" x="0" y="0" width="100%" height="100%"></rect>
    <rect class="rect rect0" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(1.080108104637282 1.0871953727733712) skewX(-6.621219972431199) rotate(223.76457180140676) translate(4.69481257355675 -1350.7082921065814) translate(-1500 -1500)"></rect><rect class="rect rect2" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(0.702597802696869 1.037131371051466) skewX(-33.3229731443951) rotate(219.12043438509096) translate(-507.14529382003207 876.9045372360309) translate(-1500 -1500)"></rect><rect class="rect rect0" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(0.9902730902858942 0.8916465065275451) skewX(-30.924802571631986) rotate(189.09857493099128) translate(-571.8635614129882 -220.12730356777843) translate(-1500 -1500)"></rect><rect class="rect rect0" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(1.086265405014246 1.0231614393855128) skewX(29.772505833930225) rotate(167.14408130348556) translate(-431.7922721243813 -649.8894491259199) translate(-1500 -1500)"></rect><rect class="rect rect2" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(1.1819117254993352 1.162383314421017) skewX(44.06739559170232) rotate(326.2527997966616) translate(-1016.3065654514725 -736.4327697193922) translate(-1500 -1500)"></rect><rect class="rect rect1" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(0.8762301153114451 0.9897611795925628) skewX(-15.455768881718285) rotate(134.24484931432607) translate(-1229.453820417144 -357.97115075898245) translate(-1500 -1500)"></rect><rect class="rect rect3" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(0.8978501406402792 1.1248782409386886) skewX(-15.933576620932804) rotate(6.611061550400441) translate(737.3824537658461 436.8173715655246) translate(-1500 -1500)"></rect><rect class="rect rect1" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(0.8302368241255771 0.7702427761727693) skewX(27.061814744070773) rotate(322.7654123298314) translate(-138.13382631853267 -1478.6815456517677) translate(-1500 -1500)"></rect><rect class="rect rect3" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(1.1427017552463625 1.2321452698804811) skewX(15.194965834046918) rotate(15.384527485549304) translate(211.87349342341565 -853.0414047479262) translate(-1500 -1500)"></rect><rect class="rect rect1" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(1.1486653461687433 0.9163269943294897) skewX(-7.264866949279451) rotate(182.90640991647695) translate(551.9857533898446 -507.6922029319528) translate(-1500 -1500)"></rect><rect class="rect rect2" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(0.9001047556628804 1.0968581148193073) skewX(-32.20238133277145) rotate(110.57345127482671) translate(56.70503364227875 991.3360682316468) translate(-1500 -1500)"></rect><rect class="rect rect3" x="0" y="0" width="100%" height="100%" transform="translate(1500 1500) scale(1.026824404166092 1.077285774016357) skewX(36.423230238983564) rotate(113.61911927912263) translate(-1418.4034887277553 422.7847954324957) translate(-1500 -1500)"></rect>
</svg>
`;
    }

}
