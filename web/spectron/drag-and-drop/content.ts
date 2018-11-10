import {SpectronRenderer} from '../../js/test/SpectronRenderer';

function onDragEnterOrOver(event: DragEvent) {
    // needed to tell the browser that onDrop is supported here...
    event.preventDefault();
}

function onDrop(event: DragEvent) {

    console.log("drop: ", event);

    console.log("drop: NR files", event.dataTransfer.files.length);
    console.log("drop: NR items", event.dataTransfer.items.length);

    for (const file of Array.from(event.dataTransfer.files)) {
        console.log("FIXME: ", file);
        console.log("FIXME: " + file.path);
    }

    for (const item of Array.from(event.dataTransfer.items)) {
        console.log("FIXME: ", item);
        // item.get
    }

    if (event.dataTransfer.effectAllowed === 'copyLink') {

        const link = event.dataTransfer.getData('text/plain');

        console.log("FIXME: link ", link);

        console.log("FIXME0: ", event.dataTransfer.getData('text/plain'));
        console.log("FIXME1: ", event.dataTransfer.getData('text/html'));
        console.log("FIXME2: ", event.dataTransfer.getData('URL'));

    }

}

SpectronRenderer.run(async (state) => {

    console.log("Running within SpectronRenderer now.");
    // you can also update the result in the renderer
    // state.testResultWriter.write(true);

    document.body.addEventListener('drop', event => onDrop(event));

    document.body.addEventListener('dragover', event => {
        console.log("dragover: ", event);
    });

    document.body.addEventListener('dragenter', (event) => onDragEnterOrOver(event));
    document.body.addEventListener('dragover', (event) => onDragEnterOrOver(event));

});


