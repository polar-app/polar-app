/* global $ */

import $ from '../../../web/js/ui/JQuery';
import 'bootstrap';
import 'summernote/dist/summernote-bs4';

// import 'summernote/dist/summernote';
// import 'bootstrap/dist/js/src/modal';
// import 'bootstrap/js/src/dropdown';
// import 'bootstrap/js/src/tooltip';

// require('bootstrap/js/dist/modal.js');
// require('bootstrap/js/dist/dropdown.js');
// require('bootstrap/js/dist/tooltip.js');
// // require('bootstrap/dist/css/bootstrap.css');
// // require('font-awesome/css/font-awesome.css');
// // require('summernote/dist/summernote.css');
// // require('summernote/dist/summernote-bs4');
//
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {ReactSummernote4} from '../../js/apps/card_creator/elements/schemaform/ReactSummernote4';
import ReactSummernote from '../../js/apps/card_creator/elements/schemaform/ReactSummernote';

SpectronRenderer.run(async () => {

    // this disables tab input so that we can go back and forth between editor
    // controls easily.
    // delete (<any> $).summernote.options.keyMap.pc.TAB;
    // delete (<any> $).summernote.options.keyMap.mac.TAB;
    //
    // $('.summernote').summernote({
    //     height: 300,
    //     minHeight: 150,
    //     airMode: true
    // });

    ReactDOM.render(
        <ReactSummernote4

            value=""
            options={{
                id: 'my-summernote',
                lang: 'en-US',
                height: 280,
                placeholder: "this is a placeholder",
                dialogsInBody: false,
                airMode: true,
                // toolbar: [
                //     ['style', []],
                //     ['font', []],
                //     ['fontname', []],
                //     ['para', []],
                //     ['table', []],
                //     ['insert', []],
                //     ['view', []],
                //     ['image', []]
                // ]

                // FIXME: add blockquote, code, and pre, and cite

                // missing the highlight color pulldown...

                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear', 'color', 'superscript', 'subscript']],
                    // ['fontname', ['fontname']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', []]
                ]

            }}
            />,
        document.getElementById("app")
    );


});



