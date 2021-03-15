import {Files} from "polar-shared/src/util/Files";
import {HackerNewsContent} from "./HackerNewsContents";

export class ConvertToMarkdown {

    public static async convert() {

        const data = await Files.readFileAsync('crawler.json');
        const content = data.toString('utf-8');
        const posts: ReadonlyArray<HackerNewsContent> = JSON.parse(content);

        let idx = 1;
        for (const post of posts) {

            const docInfo = {
                title: post.title
            };

            const params = {
                docInfo: encodeURIComponent(JSON.stringify(docInfo))
            };

            console.log(`## ${idx}. [${post.title}](https://app.getpolarized.io/add/?file=${post.link}&docInfo=${params.docInfo})`);
            console.log(`score: ${post.score} [ ${post.nrComments} comments](${post.commentsURL})`);

            idx++;
        }

    }

}

ConvertToMarkdown.convert()
    .catch(err => console.error(err));
