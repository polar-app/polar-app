const interact = require("interactjs");
const $ = require("jquery");
const assert = require("assert");
const {Rects} = require("../../../web/js/Rects");
const {Objects} = require("../../../web/js/util/Objects");
const {Styles} = require("../../../web/js/util/Styles");
const {assertJSON} = require("../../../web/js/test/Assertions");
const {Rect} = require("../../../web/js/Rect");
const {ResizeRectAdjacencyCalculator} = require("../../../web/js/pagemarks/controller/interact/resize/ResizeRectAdjacencyCalculator");
const {RectEdges} = require("../../../web/js/pagemarks/controller/interact/edges/RectEdges");
const {Preconditions} = require("../../../web/js/Preconditions");
const {BoxController} = require("../../../web/js/boxes/controller/BoxController");


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

