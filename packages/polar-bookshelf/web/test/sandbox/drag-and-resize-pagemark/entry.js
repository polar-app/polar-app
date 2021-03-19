const interact = require("interactjs");
const $ = require("jquery");
const assert = require("assert");
const {Rects} = require("../../../js/Rects");
const {Objects} = require("../../../js/util/Objects");
const {Styles} = require("../../../js/util/Styles");
const {Rect} = require("../../../js/Rect");
const {ResizeRectAdjacencyCalculator} = require("../../../js/pagemarks/controller/interact/resize/ResizeRectAdjacencyCalculator");
const {RectEdges} = require("../../../js/pagemarks/controller/interact/edges/RectEdges");
const {Preconditions} = require("../../../js/Preconditions");
const {BoxController} = require("../../../js/boxes/controller/BoxController");


$(document).ready( () => {

    let boxController = new BoxController((boxMoveEvent) => {

        console.log("boxMoveEvent: " + JSON.stringify(boxMoveEvent, null, "  "));

    });

    console.log("Ready now...");

    console.log("Interact setup!");
    // init("#pagemark0");
    // init("#pagemark1");

    boxController.register(".resize-drag");

});

