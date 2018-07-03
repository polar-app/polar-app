
// this is as simple as calling:
//
// window.getSelection().getRangeAt(0).getClientRects();

function getSelectionCoords(win) {

    win = win || window;
    let doc = win.document;
    let sel = doc.selection, range, rects, rect;
    let x = 0, y = 0;

    sel = win.getSelection();

    // rangeCount is usually always 1 unless a script is used.

    if (sel.rangeCount) {

        range = sel.getRangeAt(0).cloneRange();
        if (range.getClientRects) {
            range.collapse(true);
            rects = range.getClientRects();
            if (rects.length > 0) {
                rect = rects[0];
            }
            x = rect.left;
            y = rect.top;
        }

        // Fall back to inserting a temporary element
        if (x === 0 && y === 0) {
            throw new Error("Unable to compute selection.");
        }

    }

    return { x, y };

}

// FIXME there is also the TEXT offset of the range... which make this FURTHER suck.

// I think I can do this if I JUST use toString and not the text at each
// location... that part is much harder for now.

// FIXME:
//
//  this works but its' actually the cloned elements, not the live ones:
//
// window.getSelection().getRangeAt(0).cloneContents().querySelectorAll("*");

// this clone hack won't work becuase the offset and getClientRects won't work..

// I can do:
//
// commonAncestorContainer.querySelectorAll("*").isNodeInRange
//
// https://developer.mozilla.org/en-US/docs/Web/API/Range/compareNode
//
// but what about the text?
//
// this is the world SHITTIEST API.. AHA!.. I can do this by cloning the content
// and then mapping the element position to teh element in the original and using the
// clientRects in the original to get me the text ... I think... or I would need to
// use the boundingClientRects to do this.. I thin.

// notes:
//
// the whitespace at the beginning of a range counts as part of the offset...
// even though it is not visible.

function getElementsInSelection(range) {
    range.cloneContents(); c.querySelectorAll('*')
}


// https://stackoverflow.com/questions/667951/how-to-get-nodes-lying-inside-a-range-with-javascript

function getNextNode(node)
{
    if (node.firstChild)
        return node.firstChild;
    while (node)
    {
        if (node.nextSibling)
            return node.nextSibling;
        node = node.parentNode;
    }
}
