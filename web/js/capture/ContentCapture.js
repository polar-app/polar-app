class ContentCapture {

    // FIXME: remove meta http-equiv Location redirects from the raw HTML.

    // FIXME: don't allow meta charset and other ways to set the charset within the
    // HTML file as we are ALWAYS UTF-8 since we're sending it to the caller
    // in JSON.  For example, if the encoding is ISO-8859-4 from teh original
    // source , and sent to use that way, we would store it that way but
    // re-represent it as UTF-8 which is then invalid.

    // FIXME: <script> within SVG also needs to be stripped!

    /**
     * Capture the page as HTML so that we can render it static.
     */
    static captureHTML(contentDoc, url, result) {

        const ENABLE_IFRAMES = true;

        if(! contentDoc) {
            // this is the first document were working with.
            contentDoc = document;
        }

        if(! result) {

            result = {
                capturedDocuments: [],
                type: "chtml",
                version: "2.0.0",
                title: contentDoc.title,
                url: contentDoc.location.href,
            }

        }

        let cloneDoc = contentDoc.cloneNode(true);

        let capturedDocument = ContentCapture.captureDoc(cloneDoc, contentDoc.location.href);
        result.capturedDocuments.push(capturedDocument);

        if(ENABLE_IFRAMES) {

            console.log("Going to export iframes now.");

            // this doesn't always work and I think we need to fundamentally
            // re-think our strategy here. I might have to keep track of all the
            // webContents loaded and work with them directly.

            // VM856:46 Uncaught DOMException: Failed to read the 'contentDocument' property from 'HTMLIFrameElement': Blocked a frame with origin "https://www.cnn.com" from accessing a cross-origin frame.
            //     at <anonymous>:46:27
            //     at NodeList.forEach (<anonymous>)
            //     at Function.captureHTML (<anonymous>:42:51)
            //     at <anonymous>:1:16
            //     at EventEmitter.electron.ipcRenderer.on (/home/burton/projects/polar-bookshelf/node_modules/electron/dist/resources/electron.asar/renderer/init.js:75:28)
            //     at emitMany (events.js:147:13)
            //     at EventEmitter.emit (events.js:224:7)

            // now recurse into all the iframes in this doc and capture their HTML too.
            let iframes = contentDoc.querySelectorAll("iframe");

            console.log("Found N iframes: " + iframes.length);

            let nrHandled = 0;
            let nrSkipped = 0;

            iframes.forEach(function (iframe) {

                // TODO: only work with http and https URLs.

                if(iframe.contentDocument != null) {

                    let href = iframe.contentDocument.location.href;

                    console.log("Going to capture iframe: ", href);
                    ContentCapture.captureHTML(iframe.contentDocument, href, result);

                    ++nrHandled;

                } else {
                    console.log("Skipping iframe: " + iframe.outerHTML);
                    ++nrSkipped;
                }

            });

            console.log(`Handled ${nrHandled} and skipped ${nrSkipped} iframes`);

        }

        return result;

    }

    static captureDoc(cloneDoc, url) {

        if(!cloneDoc) {
            throw new Error("No cloneDoc");
        }

        // FIXME: include a fingerprint in the output JSON which should probably
        // be based on the URL.

        // TODO: store many of these fields in the HTML too because the iframes
        // need to have the same data
        let result = {

            // TODO: capture HTML metadata including twitter card information
            // which we could show in the UI.  Since we are capturing the whole
            // HTML though we could do this at any time in the future.

            title: cloneDoc.title,

            // The document href / location as loaded.
            href: url,
            url: url,

            // The scroll height of the document as it is currently rendered.
            // This is used as a hint for loading the static form of the
            // document.
            scrollHeight: cloneDoc.documentElement.scrollHeight,

            scrollBox: {
                width: cloneDoc.documentElement.scrollWidth,
                height: cloneDoc.documentElement.scrollHeight,
            },

            // The content as an HTML string
            content: null,

            mutations: {
                scriptsRemoved: 0,
                eventAttributesRemoved: 0,
                existingBaseRemoved: false,
                baseAdded: false,
                javascriptAnchorsRemoved: 0
            }

        };

        // remove the script elements as these are active and we do not want
        // them loaded in the future.
        cloneDoc.querySelectorAll("script").forEach(function (scriptElement) {
            scriptElement.parentElement.removeChild(scriptElement);
            ++result.mutations.scriptsRemoved;
        });

        // make sure the script removal worked
        if(cloneDoc.querySelectorAll("script").length !== 0) {
            throw new Error("Unable to remove scripts");
        }

        // now insert a 'base' href so that all pages can load URLs properly.
        if (! cloneDoc.head) {
            cloneDoc.insertBefore(cloneDoc.createElement("head"), cloneDoc.firstChild);
        }

        let base = cloneDoc.querySelector("base");

        if(base) {
            // remove the current 'base' if one exists...
            base.parentElement.removeChild(base);
            result.mutations.existingBaseRemoved = true;
        }

        // *** create a NEW base element for this HTML

        base = cloneDoc.createElement("base");
        base.setAttribute("href", result.href);

        if(cloneDoc.head.firstChild != null) {
            // base must be the first element
            cloneDoc.head.insertBefore(base,cloneDoc.head.firstChild);
        } else {
            cloneDoc.head.appendChild(base);
        }

        result.mutations.baseAdded = true;

        //***  add metadata into the HTML for polar

        document.head.appendChild(ContentCapture.createMeta("polar-url", result.url));

        //*** remove javascript html onX elements.

        const EVENT_ATTRIBUTES = ContentCapture.createEventAttributes();

        cloneDoc.querySelectorAll("*").forEach(function (element) {

            Array.from(element.attributes).forEach(function(attr) {
                if(EVENT_ATTRIBUTES[attr.name]) {
                    element.removeAttribute(attr.name);
                    ++result.mutations.eventAttributesRemoved;
                }
            });

        });

        // *** remove javascript: anchors.

        cloneDoc.querySelectorAll("a").forEach(function (element) {

            let href = element.getAttribute("href");
            if(href && href.indexOf("javascript:") === 0) {
                element.removeAttribute("href");
                ++result.mutations.javascriptAnchorsRemoved;
            }

        });

        result.mutations.showAriaHidden = ContentCapture.cleanupShowAriaHidden(cloneDoc);

        result.content = ContentCapture.toOuterHTML(cloneDoc)

        return result;

    }

    static cleanupShowAriaHidden(cloneDoc) {

        let mutations = 0;

        cloneDoc.querySelectorAll("*").forEach(function (element) {
            if(element.getAttribute("aria-hidden") === "true") {
                element.setAttribute("aria-hidden", "false");
                ++mutations;
            }
        });

        return mutations;

    }

    static cleanupFullStylesheetURLs(cloneDoc) {

        let mutations = 0;

        cloneDoc.querySelectorAll("a").forEach(function (element) {

            let href = element.getAttribute("href");
            if(href) {
                element.setAttribute("aria-hidden", "false");
                ++mutations;
            }
        });

        return mutations;

    }

    static doctypeToOuterHTML(doctype) {

        return "<!DOCTYPE "
               + doctype.name
               + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '')
               + (!doctype.publicId && doctype.systemId ? ' SYSTEM' : '')
               + (doctype.systemId ? ' "' + doctype.systemId + '"' : '')
               + '>';

    }

    static createMeta(name,content) {
        let meta = document.createElement("meta");
        meta.setAttribute("name", name);
        meta.setAttribute("content", content);
        return meta;
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

        if(doc.doctype) {

            return ContentCapture.doctypeToOuterHTML(doc.doctype) +
                   "\n" +
                   doc.documentElement.outerHTML;

        } else {
            return doc.documentElement.outerHTML;
        }


    }

    static createEventAttributes() {

        return Object.freeze({
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
        });
    }

}

function debug() {

    // try to capture the current HTML page...
    return ContentCapture.captureHTML();

}

module.exports.ContentCapture = ContentCapture;

