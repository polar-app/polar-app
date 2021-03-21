import {MetadataEngine} from "../MetadataEngines";
import {Page} from "../Pages";
import {URLStr} from "polar-shared/src/util/Strings";
import {Groups} from "../../../groups/db/Groups";
import {Logger} from "polar-shared/src/logger/Logger";
import {GroupHighlightURLs} from "polar-webapp-links/src/groups/GroupHighlightURLs";
import {GroupDocAnnotations} from "../../../groups/db/doc_annotations/GroupDocAnnotations";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextHighlights} from "polar-shared/src/metadata/ITextHighlights";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {HTMLSanitizer} from "polar-html/src/sanitize/HTMLSanitizer";
import {DEFAULT_IMG} from "./DefaultMetadataEngine";
import {Articles} from "../jsonld/Article";
import {DEFAULT_IMAGE_OBJECT, IImageObject, ImageObjects} from "../jsonld/ImageObject";
import {ProfileIDStr, Profiles, UserIDStr} from "../../../groups/db/Profiles";
import {ANONYMOUS_PERSON, Persons} from "../jsonld/Person";
import {DEFAULT_PUBLISHER} from "../jsonld/Organization";
import {Permalinks} from "../Permalinks";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {ProfileOwners} from "../../../groups/db/ProfileOwners";
import {FirebaseFileStorage} from "polar-firebase/src/firebase/files/FirebaseFileStorage";

const log = Logger.create();

/**
 *
 * /group/:group/highlight/:id
 *
 */
export class GroupHighlightMetadataEngine implements MetadataEngine {

    public async compute(url: URLStr): Promise<Page | undefined> {

        const parsedURL = GroupHighlightURLs.parse(url);

        const groupName = parsedURL.name;

        // Always verify that this is a public group
        const group = await Groups.verifyPublic({groupName}, () => Groups.getByName(groupName));

        const groupDocAnnotation = await GroupDocAnnotations.get(parsedURL.id);

        if (! groupDocAnnotation) {
            log.warn("No group doc annotation for ID: " + parsedURL.id);
            return undefined;
        }

        const toPerson = async (profileID: ProfileIDStr | undefined) => {

            if ( !profileID) {
                return ANONYMOUS_PERSON;
            }

            const profile = await Profiles.get(profileID);
            return Persons.convert(profile);

        };

        const {profileID} = groupDocAnnotation;
        const author = await toPerson(profileID);

        const toTitle = (text: string) => {

            const maxLen = 105;

            text = text.trim();

            if (text.length > maxLen) {
                return text.trim().substring(0, maxLen) + ' ...';
            }

            return text;

        };

        const convertImage = (highlight: ITextHighlight | IAreaHighlight): IImageObject => {

            const getUID = (): UserIDStr | undefined => {

                if (profileID) {
                    ProfileOwners.getByProfileID(profileID);
                }

                return undefined;

            };

            if (highlight.image) {

                const uid = getUID();

                if (uid) {
                    return ImageObjects.create({
                        url: FirebaseFileStorage.getURL(highlight.image.src.backend, highlight.image.src, uid)
                    });
                }

            }


            return DEFAULT_IMAGE_OBJECT;

        };



        const createPage = (highlight: ITextHighlight | IAreaHighlight,
                            title: string,
                            text: string): Page => {

            const image = convertImage(highlight);

            const createArticle = () => {

                url = Permalinks.absolute(url);

                const datePublished = highlight.created;
                const dateModified = highlight.lastUpdated;

                return Articles.create({
                    "@id": url,
                    url,
                    description: text,
                    mainEntityOfPage : url,
                    headline: title,
                    text,
                    datePublished,
                    dateModified,
                    image,
                    author,
                    publisher: DEFAULT_PUBLISHER
                });

            };

            return {
                title,
                description: text,
                canonical: url,
                card: 'summary',
                image,
                article: createArticle(),
            };

        };

        const convertTextHighlight = (): Page => {

            const highlight = <ITextHighlight> groupDocAnnotation.original;
            const html = ITextHighlights.toHTML(highlight);

            const text = HTMLSanitizer.toText(html || "");
            const title = toTitle(text);

            return createPage(highlight, title, text);

        };

        const convertAreaHighlight = (): Page => {

            const highlight = <IAreaHighlight> groupDocAnnotation.original;

            const title = "Highlight created by " + author.name;
            const text = title;

            return createPage(highlight, title, text);

        };

        if (groupDocAnnotation.annotationType === AnnotationType.TEXT_HIGHLIGHT) {
            return convertTextHighlight();
        }

        if (groupDocAnnotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {
            return convertAreaHighlight();
        }

        return undefined;

    }

}
