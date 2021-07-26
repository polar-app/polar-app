import * as stopwords from 'stopword';
import { Optional } from './ts/Optional';

/**
 * A slug string which contains no newlines, spacing, etc.
 */
export type SlugStr = string;

/**
 * An international string that allows chars other than just english.
 */
export type SlugIntlStr = string;

/**
 * Compute slugs from strings for use in file names, SEO URLs, etc.
 */
export namespace Slugs {

    export function calculate(text: string, lang: string = "en"): SlugStr {

        // TODO: we are NOT using the lang and should in the future.

        return Optional.of(text)
                // first remove long runs of whitespace
                .map(current => current.replace(/[^a-zA-Z0-9]+/g, ' '))
                // trim the string now
                .map(current => current.trim())
                // then split it by space
                .map(current => current.split(' '))
                // remove the stopwords
                .map(current => stopwords.removeStopwords(current))
                // then rejoin with a single hyphen
                .map(current => current.join('-'))
                .get();

    }

    /**
     * Different encoding algorithm that works with international languages
     */
    export function calculateIntl(text: string): string {

        return Optional.of(text)
            // first remove long runs of whitespace and make them use one whitespace character
            .map(current => current.replace(/\s+/g, ' '))
            // trim the string now so that there is no whitespace at the ends
            .map(current => current.trim())
            // now strip out all punctuation
            .map(current => current.replace(/[.,\/#!$%\^&\*;:{}=\-_`~]/g, ""))
            // then split it by space
            .map(current => current.split(' '))
            // then rejoin with a single hyphen
            .map(current => current.join('-'))
            .get();

    }

}
