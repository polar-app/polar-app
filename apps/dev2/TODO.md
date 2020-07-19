

// FIXME ... searching for "In practice" starts off at the wrong place...
// "Graph" does the same thing...

// FIXME if a highlight is across rows, then what happens is that we get a
// break to the next row... we might want to just highlight the individual
// elements so that we don't have to mutate the DOM and node split...

// FIXME: I think having ONE div per character is probably a BAD idea but
// so is DOM mutation from within React ... it's hacky but I could put it
// into a hook...

// FIXME: I'm going to need unit tests for common operations:

// FIXME: what I could do here is split the text by words... based on whitespace
//
// FIXME: I would ALSO need to join the text so that the current highlight
// runs up , I think. to the start of the next node, but this might trigger a warap

// FIXME: do not split the node based on the text, split the regions we
// want to highlight... so that each reagoin would start off like
//
// 'hello world'
//
// and then I would map them to:
//
// 'hello '
// 'world'

// FIXME: we can't break on whitespace word boundaries as the browser has
// its own set of boundaries like '-' that hyphenates words...

// FIXME: it can break at ANY character!!! so there's no way to determine
// if some text is overflowed...

// FIXME: I could 'cheat' and for every character, compute the region, and
// then stitch them together so they are overlayed properly???
//
//   - I think I ALREADY have an algorithm to do this that I just need to
//     lift out now...

// FIXME: text within overflow regions is being shown even if the text is
// ABOVE the overflow window...
//
// FIXME - for now just punt on nodes that are hidden like this.

// FIXME: just compute the rows and then groupBy top/bottom being identical..
//
