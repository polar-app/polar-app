const jquery = require("jquery");

declare var global: any;
global.$ = global.jQuery = jquery;

/**
 * Allows us to seems like we're easily importing JQuery but also defines it
 * globally so that other libraries can use it properly. JQuery isn't a modern
 * module so it requires hacks to work with other libraries like jquery-ui and
 * summernote.
 *
 * @param arg
 * @return {any}
 */
export default function $(arg: any): any {
    return jquery(arg);
}
