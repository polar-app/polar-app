import {JSDOM} from "jsdom";

const dom = new JSDOM(``, {url: 'https://www.example.com'});
global.document = dom.window.document;
(global as any).window = dom.window;
(global as any).localStorage = dom.window.localStorage;
(global as any).navigator = dom.window.navigator;
(global as any).performance = dom.window.performance;
(global as any).window.requestAnimationFrame = (delegate: () => void) => setTimeout(() => delegate(), 1);
