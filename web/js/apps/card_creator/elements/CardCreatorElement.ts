import {CreateFlashcardForm} from './schemaform/CreateFlashcardForm';

export class CardCreatorElement extends HTMLElement {

    constructor() {

        super();

        let shadowRoot = this.attachShadow({mode: 'closed'});

        // FIXME: this will change based on the component so I guess I have to
        // find it via __dirname ?

        const NODE_MODULES='../../node_modules';

        let template = `    
        <link rel="stylesheet" href="${NODE_MODULES}/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="${NODE_MODULES}/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="${NODE_MODULES}/bootstrap/dist/css/bootstrap-grid.min.css">
        <link rel="stylesheet" href="${NODE_MODULES}/bootstrap/dist/css/bootstrap-reboot.min.css">
        <link rel="stylesheet" href="../../bootstrap4-glyphicons/maps/glyphicons-fontawesome.min.css">
        <link rel="stylesheet" href="${NODE_MODULES}/summernote/dist/summernote-bs4.css">
    
        <!-- we should be able to use bootstrap v4 but the CSS for this is actually
             better with 3.3.6 -->
        <!--<link rel="stylesheet" id="theme" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">-->
        <link rel="stylesheet" href="${NODE_MODULES}/simplemde/dist/simplemde.min.css">

        <!--<link rel="stylesheet" href="css/card-creator.css">-->
    
        <div id="app">
    
            <div id="schema-form">
                 schema form goes here...
            </div>

        </div>
        `;

        // //let cloneElement = this.importNode(template.content, true);

        let mainElement = shadowRoot.appendChild(CardCreatorElement.createElementHTML(template));

        let schemaFormElement = <HTMLElement>shadowRoot.getElementById("schema-form");

        let inputController = new CreateFlashcardForm(schemaFormElement);


        //let postMessageFormHandler = new PostMessageFormHandler();

        // TODO: removed while we refactor
        // inputController.createNewFlashcard(schemaFormElement, postMessageFormHandler);

        shadowRoot.appendChild(mainElement);

    }

    /**
     * Create a div from the given innerHTML and return it.
     */
    static createElementHTML(innerHTML: string): HTMLElement {

        let div = document.createElement("div");
        div.innerHTML = innerHTML;

        return div;

    }

}
