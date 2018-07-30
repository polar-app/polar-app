import {CreateFlashcardInputController} from './schemaform/CreateFlashcardInputController';
import {FormHandler} from '../FormHandler';

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

        let inputController = new CreateFlashcardInputController();

        let schemaFormElement = <HTMLElement>shadowRoot.getElementById("schema-form");

        let postMessageFormHandler = new PostMessageFormHandler();

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

class PostMessageFormHandler extends FormHandler {

    onChange(data: any) {
        console.log("onChange: ", data);
        //window.postMessage({ type: "onChange", data: dataToExternal(data)}, "*");
    }

    onSubmit(data: any) {
        //
        // data = Objects.duplicate(data);
        //
        // // we have to include the docDescriptor for what we're working on so
        // // that the recipient can decide if they want to act on this new data.
        // data.context = this.context;
        //
        // // for now we (manually) support flashcards
        // data.annotationType = AnnotationType.FLASHCARD;
        //
        // // the metadata for creating the flashcard type.  This should probably
        // // move to the schema in the future.  The ID is really just so that
        // // we can compile the schema properly.
        // data.flashcard = {
        //     id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea"
        // };
        //
        // console.log("onSubmit: ", data);
        // //window.postMessage({ type: "onSubmit", data: dataToExternal(data)}, "*");
        //
        // // send this to the main process which then broadcasts it to all the renderers.
        // ipcRenderer.send('create-annotation', data);
        //
        // // don't close when we're the only window and in dev mode.
        // // FIXME: window.close();

    }


    onError(data: any) {
        console.log("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)}, "*");
    }

}
