/**
 * Represents content that has been parsed from HTML with data URLs to Anki
 * compatible HTML with images pointing to filenames reference in an array of
 * Media objects.
 */
import {MediaFile} from './clients/StoreMediaFileClient';

export interface MediaContent {

    readonly content: string;

    readonly mediaFiles: MediaFile[];

}
