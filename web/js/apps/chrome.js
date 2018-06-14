//const {$} = require('jquery');
const {DocMeta} = require("../metadata/DocMeta");
const {DocMetas} = require("../metadata/DocMetas");
const {DocInfo} = require("../metadata/DocInfo");
const {Controller} = require("../controller/Controller.js");

const {PersistenceLayer} = require("../datastore/PersistenceLayer.js");
const {MemoryDatastore} = require("../datastore/MemoryDatastore.js");
const {Electron} = require("../Electron");
const {Launcher} = require("./Launcher");


function createDocMeta0() {

    // create some fake documents for our example PDFs
    let fingerprint = "110dd61fd57444010b1ab5ff38782f0f";

    let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
    DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})
    return docMeta;

}

function createDocMeta1() {

    // create some fake documents for our example PDFs
    let fingerprint = "htmldoc01";

    let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 1);
    DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 1, percentage: 25})
    return docMeta;

}



async function persistenceLayerFactory() {

    console.log("Using mock persistence layer and memory store");

    let datastore = new MemoryDatastore();
    let persistenceLayer = new PersistenceLayer(datastore);

    await persistenceLayer.init();

    await persistenceLayer.syncDocMeta(createDocMeta0());
    await persistenceLayer.syncDocMeta(createDocMeta1());

    return persistenceLayer;

}

new Launcher(persistenceLayerFactory).launch().then(function () {
    console.log("App now loaded.");
});
