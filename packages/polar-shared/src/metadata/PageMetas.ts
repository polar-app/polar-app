import {forDict} from '../util/Functions';
import {Hashcodes} from '../util/Hashcodes';
import {Pagemarks} from './Pagemarks';
import {isPresent} from '../Preconditions';
import {IPageMeta} from "./IPageMeta";

export class PageMetas {

    public static upgrade(pageMetas: {[key: number]: IPageMeta}) {

        pageMetas = Object.assign({}, pageMetas);

        forDict(pageMetas, (key, pageMeta) => {

            if (! isPresent(pageMeta.textHighlights)) {
                // log.debug("No textHighlights.  Assigning default.");
                pageMeta.textHighlights = {};
            }

            // make sure legacy / old text highlights are given IDs.
            forDict(pageMeta.textHighlights, (_, textHighlight) => {
                if (! textHighlight.id) {
                    // log.debug("Text highlight given ID");
                    textHighlight.id = Hashcodes.createID(textHighlight.rects);
                }
            });

            // TODO: too much boilerplate here.

            if (! isPresent(pageMeta.areaHighlights)) {
                // log.debug("No areaHighlights.  Assigning default.");
                pageMeta.areaHighlights = {};
            }

            if (!pageMeta.pagemarks) {
                // log.debug("No pagemarks.  Assigning default (empty map)");
                pageMeta.pagemarks = {};
            }

            if (!pageMeta.screenshots) {
                // log.debug("No screenshots.  Assigning default (empty map)");
                pageMeta.screenshots = {};
            }

            if (!pageMeta.notes) {
                // log.debug("No notes.  Assigning default (empty map)");
                pageMeta.notes = {};
            }

            if (!pageMeta.comments) {
                // log.debug("No comments.  Assigning default (empty map)");
                pageMeta.comments = {};
            }

            if (!pageMeta.questions) {
                // log.debug("No questions.  Assigning default (empty map)");
                pageMeta.questions = {};
            }

            if (!pageMeta.readingProgress) {
                // log.debug("No readingProgressLog.  Assigning default (empty map)");
                pageMeta.readingProgress = {};
            }

            if (!pageMeta.thumbnails) {
                pageMeta.thumbnails = {};
            }

            if (!pageMeta.flashcards) {
                pageMeta.flashcards = {};
            }

            pageMeta.pagemarks = Pagemarks.upgrade(pageMeta.pagemarks);

        });

        return pageMetas;

    }

}
