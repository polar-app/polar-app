import {HTMLStr} from "polar-shared/src/util/Strings";

export namespace XHTMLWrapper {

    export interface WrapOptions {
        readonly title: string;
        readonly content: HTMLStr;
    }

    export function wrap(opts: WrapOptions) {
        return `<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>${opts.title}</title>
</head>
<body>
${opts.content}
</body>
</html>`;
    }
}
