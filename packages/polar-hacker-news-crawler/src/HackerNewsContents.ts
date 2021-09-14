import {JSDOM} from "jsdom";
import {Arrays} from "polar-shared/src/util/Arrays";

interface CommentMeta {

    readonly commentsURL: string;

    readonly nrComments: number;

}

export interface HackerNewsContent extends CommentMeta {

    readonly title: string;

    readonly link: string;

    readonly score: number;

}

export class HackerNewsContents {

    public static parse(content: string): ReadonlyArray<HackerNewsContent> {

        const result: HackerNewsContent[] = [];

        const jsdom = new JSDOM(content);
        const doc = jsdom.window.document;

        const rows = doc.querySelectorAll(".itemlist tr");

        for (let idx = 0; idx < 30; idx++) {
            const offset = idx * 3;
            const linkRow = rows[offset];
            const metadataRow = rows[offset + 1];

            if (! linkRow || ! metadataRow) {
                continue;
            }

            const anchor = linkRow.querySelector(".title a");

            const link = anchor!.getAttribute('href')!;
            const title = anchor!.textContent!;

            if (! link.startsWith("http")) {
                continue;
            }

            const computeScore = () => {

                const scoreElement = metadataRow.querySelector(".score");

                if (! scoreElement) {
                    return undefined;
                }

                const scoreText = scoreElement!.textContent!;

                if (! scoreText) {
                    return undefined;
                }

                return parseInt(scoreText.replace(" points", ""));

            };

            const computeCommentMeta = (): CommentMeta | undefined => {

                const metadataLinks = Array.from(metadataRow.querySelectorAll("a"));

                const commentURLElement = Arrays.last(metadataLinks);

                if (commentURLElement) {

                    const computeNrComments = () => {
                        const text = commentURLElement.textContent!
                            .replace(' comments', '')
                            .replace('discuss', '')
                            .trim();

                        const result = text === '' ? 0 : parseInt(text);

                        if (result === null || isNaN(result)) {
                            throw new Error("No comment count: " + text);
                        }

                        return result;
                    };

                    const nrComments = computeNrComments();
                    const commentsURL = 'https://news.ycombinator.com/' + commentURLElement.getAttribute('href');

                    return {commentsURL, nrComments};
                }

                return undefined;

            };

            const score = computeScore();

            if (! score) {
                continue;
            }

            const commentMeta = computeCommentMeta();

            if (! commentMeta) {
                continue;
            }

            // console.log(`${title} - ${link}: ${score} - ${commentURL}`);

            result.push({
                title, link, score, ...commentMeta
            });

        }

        return result;

    }

}
