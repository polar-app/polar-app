const $ = require("jquery"); jQuery = $;
const jcm = require("jquery-contextmenu");
const featherlight = require('featherlight');
const {Elements} = require("../../web/js/util/Elements.js");
const SimpleMDE = require("simplemde");

function cmdAddFlashcard() {

    console.log("Adding flashcard");

    createModal();
}

function createModal() {

    let innerHTML = `<div id="mylightbox" class="polar-lightbox">

        <div id="editor-content">
            <textarea id="editor" autofocus></textarea>
        </div>
        
        <div class="modal-footer">
            <button id="markdown-editor-save">Save</button>
        </div>
        
    </div>
    `;

    let lightbox = Elements.createElementHTML(innerHTML);

    $.featherlight($(lightbox).show());

    let editorElement = document.querySelector("#editor");

    if (! editorElement)
        throw new Error("No editor element");

    console.log("Setting up simplemde");

    // TODO: why no spell checker?
    let simplemde = new SimpleMDE({
        editorElement,
        spellChecker: true,
        hideIcons: ["side-by-side", "fullscreen"]
    } );

    //simplemde.toggleSideBySide(editor);
    // simplemde.value();

    // FIXME: attach code to the button so that when the user hits save then we
    // can handle it properly.

}



$(document).ready(function() {
    $(function() {
        $.contextMenu({
            selector: '.text-highlight',
            callback: function(key, options) {
                let m = "clicked: " + key;
                console.log(m);
                switch (key) {
                    case "add-flashcard":
                        cmdAddFlashcard();
                        break;

                    default:
                        break;
                }

            },
            items: {
                "create-pagemark-here": {name: "Create Pagemark Here"},
                "sep1": "---------",
                "view": {name: "View Highlight"},
                "add-flashcard": {name: "Add Flashcard"},
                "add-note": {name: "Add Note"},
                "add-comment": {name: "Add Comment"},
                "sep2": "---------",
                "delete":  {name: "Delete"},
            }
        });

        $('.text-highlight').on('click', function(e){
            console.log('clicked', this);
        })
    });

    console.log("initialized");

});
