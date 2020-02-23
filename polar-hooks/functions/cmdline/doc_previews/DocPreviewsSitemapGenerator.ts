import {FirebaseAdmin} from "../../impl/util/FirebaseAdmin";
import {DocPreview} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {URLStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

interface SitemapURL {
    readonly loc: URLStr;
    readonly lastmod?: ISODateTimeString;
    readonly changefreq?: 'weekly' | 'monthly';

    // TODO: images are supported in sitemaps.  Use a thumbnail preview
    // option

}

export class DocPreviewsSitemapGenerator {

    public static async generate() {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const snapshot = await firestore.collection('doc_preview')
                                        .limit(1000)
                                        .get();

        const docPreviews = snapshot.docs.map(doc => doc.data() as DocPreview);

        const toSitemapURL = (docPreview: DocPreview): SitemapURL => {

            const loc = DocPreviewURLs.create({
                id: docPreview.urlHash,
                category: docPreview.category,
                title: docPreview.title
            });

            return {loc, changefreq: 'weekly'};

        };

        const sitemapURLs = docPreviews.map(toSitemapURL);

        const toXML = (sitemapURLs: SitemapURL[]) => {

            console.log('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

            for (const sitemapURL of sitemapURLs) {
                console.log('<url>');

                if (sitemapURL.changefreq) {
                    console.log(`<changefreq>${sitemapURL.changefreq}</changefreq>`);
                }

                console.log(`<loc>${sitemapURL.loc}</loc>`);
                console.log('</url>');
            }

            console.log('</urlset>');

        };

        toXML(sitemapURLs);

    }

}

DocPreviewsSitemapGenerator.generate()
    .catch(err => console.error(err));
