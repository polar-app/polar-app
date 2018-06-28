class ContentCapture {

    // FIXME: remove meta http-equiv Location redirects from the raw HTML.

    // FIXME: don't allow meta charset and other ways to set the charset within the
    //        HTML file as we are ALWAYS UTF-8

    // FIXME: <script> within SVG also needs to be stripped!

    /**
     * Capture the page as HTML so that we can render it static.
     */
    static captureHTML(contentDoc, result) {

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

        // now recurse into all the iframes in this doc and capture their HTML too.
        contentDoc.querySelectorAll("iframe").forEach(function (iframe) {

            if(iframe.contentDocument != null) {
                console.log("Going to capture iframe: ", iframe.contentDocument.location.href);
                ContentCapture.captureHTML(iframe.contentDocument, result);
            } else {
                console.log("Skipping iframe: " + iframe.outerHTML);
            }

        });

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

    static cleanupInlineIframes(cloneDoc) {

        // TODO: these stats aren't merged across all iframes recursively.  nor
        // do we have stats for them all.  I could pass one object around with
        // stats per URL and possibly nest the objects into a tree.
        let result = {

        };

        // TODO: this code SHOULD work but I need more real world tests and I
        // need to get pagination to work.


        // FUCK !!! ahah1!! the cloneDoc DOES not have a content document
        // because I imagine it's not cloned!!!

        cloneDoc.querySelectorAll("iframe").forEach(function (iframe) {

            if(iframe.contentDocument != null) {

                console.log("Working with: ", iframe);
                cloneDoc = iframe.contentDocument.cloneNode(true);
                let capturedFrame = ContentCapture.captureHTML(cloneDoc);
                iframe.setAttribute("src", ContentCapture.toHTMLDataURL(capturedFrame.content));
                result[capturedFrame.href] = capturedFrame;

            } else {
                console.log("Skipping iframe: " + iframe.outerHTML);
            }

        });

        return result;

    }

    static toHTMLDataURL(content) {
        return 'data:text/html,' + encodeURIComponent(content);
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

