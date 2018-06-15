const $ = require('jquery')
jQuery = $;
//const bootstrap = require('bootstrap');
const featherlight = require('featherlight');

// FIXME: this is not working for soem reason and I ahve NO ideawhy.. module.exports is setup properly.

const SimpleMDE = require("simplemde");
//const SimpleMDE = require("../../node_modules/simplemde/src/js/simplemde.js");

// require("marked");
// require("prettify");
// require("raphael");
// require("underscore");
//require("flowchart");

//require('editormd');
//
// jquery          : "../examples/js/jquery.min",
//     marked          : "marked.min",
//     prettify        : "prettify.min",
//     raphael         : "raphael.min",
//     underscore      : "underscore.min",
//     flowchart       : "flowchart.min",
//     jqueryflowchart : "jquery.flowchart.min",
//     sequenceDiagram : "sequence-diagram.min",
//     katex           : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min",
//     editormd        : "../editormd.amd" // Using Editor.md amd version for Require.js


function createElementHTML(innerHTML) {

    let div = document.createElement("div");
    div.innerHTML = innerHTML;

    return div;

}

function createModal2() {

    let innerHTML = `<div id="mylightbox" class="polar-lightbox" style="">
        <div id="editor-content">
            <textarea id="editor" autofocus># this is markdown</textarea>
        </div>
    </div>
    `;

    let element = createElementHTML(innerHTML);

    $(element).show();
    document.body.appendChild(element);

    let editor = document.getElementById("editor");

    if (! editor)
        throw new Error("No editor element");

    console.log("Setting up simplemde");

    // TODO: why no spell checker?
    let simplemde = new SimpleMDE({ editor, spellChecker: false });
    simplemde.value();

    editor.focus();

};

function createModal() {

    let innerHTML = `<div id="mylightbox" class="polar-lightbox">

        <div id="editor-content">
            <textarea id="editor" autofocus># this is markdown</textarea>
        </div>
        
        <div class="modal-footer">
            <button>Save</button>
        </div>
        
    </div>
    `;

    let lightbox = createElementHTML(innerHTML);

    $.featherlight($(lightbox).show());

    let editor = document.querySelector("#editor");

    if (! editor)
        throw new Error("No editor element");

    console.log("Setting up simplemde");

    // TODO: why no spell checker?
    let simplemde = new SimpleMDE({ editor, spellChecker: false, hideIcons: ["side-by-side", "fullscreen"] });
    //simplemde.toggleSideBySide(editor);
    simplemde.value();

    attachImagePasteListener($(".CodeMirror"));

    $(".CodeMirror").on('paste', function (e) {

        console.log("Got paste event in editor... ");

    });




}

function attachImagePasteListener(element) {

    $(element).on('paste', function (e) {

        console.log("Got paste event!")

        let orgEvent = e.originalEvent;
        for (let i = 0; i < orgEvent.clipboardData.items.length; i++) {
            if (orgEvent.clipboardData.items[i].kind === "file" && orgEvent.clipboardData.items[i].type === "image/png") {
                let imageFile = orgEvent.clipboardData.items[i].getAsFile();
                let fileReader = new FileReader();

                fileReader.onloadend = function () {

                    console.log(fileReader.result);

                    //$('#result').html();
                }

                fileReader.readAsDataURL(imageFile);
                break;
            }
        }
    });

}


function doLoad() {

    console.log("FIXME1");
    document.getElementById("open-button").addEventListener("click", createModal);

    $("textarea").on('paste', function (e) {

        console.log("Got paste event!");

    });

    attachImagePasteListener(document.querySelector("textarea"));

}


if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
    console.log("Already completed loading.");
    doLoad();
} else {
    console.log("Waiting for DOM content to load");
    document.addEventListener('DOMContentLoaded', doLoad, true);
}
//
// window.setTimeout(function () {
//     console.log("FIXME2: SimpleMDE: ", SimpleMDE);
//
// }, 2500);


