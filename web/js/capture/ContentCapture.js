
class ContentCapture {

    // FIXME: remove javascript: URLs

    // FIXME: children iframes need to be encoded as data URLs recursively or
    // pre-cached and re-written.

    /**
     * Capture the page as HTML so that we can render it static.
     */
    static captureHTML() {

        // FIXME: include a fingerprint in the output JSON which should probably
        // be based on the URL.

        let result = {

            // TODO: capture HTML metadata including twitter card information
            // which we could show in the UL.

            title: document.title,

            // The document href / location as loaded.
            href: document.location.href,

            // The scroll height of the document as it is currently rendered.
            // This is used as a hint for loading the static form of the
            // document.
            scrollHeight: document.documentElement.scrollHeight,

            // The content as an HTML string
            content: null

        };

        let cloneDoc = document.cloneNode(true);

        let mutations = {
            scriptsRemoved: 0,
            eventAttributesRemoved: 0,
            existingBaseRemoved: false,
            baseAdded: false
        };

        // remove the script elements as these are active.
        cloneDoc.querySelectorAll("script").forEach(function (scriptElement) {
            scriptElement.parentElement.removeChild(scriptElement);
            ++mutations.scriptsRemoved;
        });

        // make sure the script removal worked
        if(cloneDoc.querySelectorAll("script").length !== 0) {
            throw new Error("Unable to remove scripts");
        }

        // now insert a 'base' href so that all pages can load URLs properly.
        if (! cloneDoc.head) {
            cloneDoc.insertBefore(cloneDoc.createElement("head"), cloneDoc.firstChild);
        }

        // FIXME: remove the current 'base' if one exists...

        let base = cloneDoc.querySelector("base");

        if(base) {
            // base must be the first element
            base.parentElement.removeChild(base);

            mutations.existingBaseRemoved = true;

        }

        // create a NEW base element for this HTML

        base = cloneDoc.createElement("base");
        base.setAttribute("href", result.href);

        if(cloneDoc.head.firstChild != null) {
            cloneDoc.head.insertBefore(base,cloneDoc.head.firstChild);
        } else {
            cloneDoc.head.appendChild(base);
        }

        mutations.baseAdded = true;

        cloneDoc.querySelectorAll("*").forEach(function (element) {

            Array.from(element.attributes).forEach(function(attr) {
                if(EVENT_ATTRIBUTES[attr.name]) {
                    element.removeAttribute(attr.name);
                    ++mutations.eventAttributesRemoved;
                }
            });

        });

        console.log("FIXME: mutations: ", mutations)

        result.mutations = mutations;
        result.content = ContentCapture.toOuterHTML(cloneDoc);

        return result;

    }

    static doctypeToOuterHTML(doctype) {

        return "<!DOCTYPE "
               + doctype.name
               + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '')
               + (!doctype.publicId && doctype.systemId ? ' SYSTEM' : '')
               + (doctype.systemId ? ' "' + doctype.systemId + '"' : '')
               + '>';
    }

    /**
     * Convert the given doc to outerHTML including the DocType and other information.
     *
     * We return the original doc in near original condition. No major mutations.
     *
     * Note that new XMLSerializer().serializeToString(document) includes the
     * canonical form not the source form.
     *
     * @param doc
     */
    static toOuterHTML(doc) {

        // https://stackoverflow.com/questions/817218/how-to-get-the-entire-document-html-as-a-string

        // https://stackoverflow.com/questions/6088972/get-doctype-of-an-html-as-string-with-javascript

        return ContentCapture.doctypeToOuterHTML(doc.doctype) +
               "\n" +
               doc.documentElement.outerHTML;

    }

}

const EVENT_ATTRIBUTES ={
    "onafterprint": 1,
    "onbeforeprint": 1,
    "onbeforeunload": 1,
    "onerror": 1,
    "onhashchange": 1,
    "onload": 1,
    "onmessage": 1,
    "onoffline": 1,
    "ononline": 1,
    "onpagehide": 1,
    "onpageshow": 1,
    "onpopstate": 1,
    "onresize": 1,
    "onstorage": 1,
    "onunload": 1,
    "onblur": 1,
    "onchange": 1,
    "oncontextmenu": 1,
    "onfocus": 1,
    "oninput": 1,
    "oninvalid": 1,
    "onreset": 1,
    "onsearch": 1,
    "onselect": 1,
    "onsubmit": 1,
    "onkeydown": 1,
    "onkeypress": 1,
    "onkeyup": 1,
    "ondblclick": 1,
    "onmousedown": 1,
    "onmousemove": 1,
    "onmouseout": 1,
    "onmouseover": 1,
    "onmouseup": 1,
    "onmousewheel": 1,
    "onwheel": 1,
    "ondrag": 1,
    "ondragend": 1,
    "ondragenter": 1,
    "ondragleave": 1,
    "ondragover": 1,
    "ondragstart": 1,
    "ondrop": 1,
    "onscroll": 1,
    "oncopy": 1,
    "oncut": 1,
    "onpaste": 1,
    "onabort": 1,
    "oncanplay": 1,
    "oncanplaythrough": 1,
    "oncuechange": 1,
    "ondurationchange": 1,
    "onemptied": 1,
    "onended": 1,
    "onloadeddata": 1,
    "onloadedmetadata": 1,
    "onloadstart": 1,
    "onpause": 1,
    "onplay": 1,
    "onplaying": 1,
    "onprogress": 1,
    "onratechange": 1,
    "onseeked": 1,
    "onseeking": 1,
    "onstalled": 1,
    "onsuspend": 1,
    "ontimeupdate": 1,
    "onvolumechange": 1,
    "onwaiting": 1,
    "onshow": 1,
    "ontoggle": 1
};

function debug() {

    // try to capture the current HTML page...
    return ContentCapture.captureHTML();

}

module.exports.ContentCapture = ContentCapture;

