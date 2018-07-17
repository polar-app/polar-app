console.log("here");

function elementsFromEvent(event) {
    let point = {x: event.pageX, y: event.pageY};
    console.log("Getting elements from event at point: ", point);
    return document.elementsFromPoint(point.x, point.y);
}

/**
 * Create a result by looking at all the events, and all the selectors, building
 * up an index of matching elements at the position.
 * @param event
 * @param selectors
 */
function elementFromEventMatchingSelectors(event, selectors) {

    let result = {

    };

    // setup the selector result
    selectors.forEach(function (selector) {
        result[selector] = {
            selector, elements: []
        }
    });

    let elements = elementsFromEvent(event);

    elements.forEach(function (element) {

        selectors.forEach(function (selector) {

            if(element.matches(selector)) {
                result[selector].elements.push(element);
            }

        });

    });

    return result;

}

document.querySelectorAll(".textLayer").forEach(function(textLayer) {

    console.log("Adding contextmenu listener on", textLayer);

    textLayer.addEventListener("contextmenu", function (event) {

        console.log("got context menu");

        //let elements = document.elementsFromPoint(event.screenX, event.screenY);
        let elementsMatchingSelectors = elementFromEventMatchingSelectors(event, [".text-highlight", ".pagemark"]);

        console.log("FIXME: elementsMatchingSelectors", elementsMatchingSelectors);

    })

});
