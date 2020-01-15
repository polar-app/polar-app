import {JSDOM} from "jsdom";
import {Arrays} from "polar-shared/src/util/Arrays";

export interface HackerNewsContent {

}

export class HackerNewsContents {

    public static parse(content: string) {
        const jsdom = new JSDOM(content);
        const doc = jsdom.window.document;

        const rows = doc.querySelectorAll(".itemlist tr");

        for (let idx = 0; idx < 30; idx++) {
            const offset = idx * 3;
            const linkRow = rows[offset];
            const metadataRow = rows[offset + 1];

            const anchor = linkRow.querySelector(".title a");

            const link = anchor!.getAttribute('href')!;
            const title = anchor!.textContent;

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

            const computeCommentURL = () => {

                const metadataLinks = Array.from(metadataRow.querySelectorAll("a"));

                const commentURLElement = Arrays.last(metadataLinks);

                if (commentURLElement) {
                    return 'https://news.ycombinator.com/' + commentURLElement.getAttribute('href');
                }

                return undefined;

            };

            const score = computeScore();

            if (! score) {
                continue;
            }

            const commentURL = computeCommentURL();

            console.log(`${title} - ${link}: ${score} - ${commentURL}`);

        }

        console.log(rows.length);

    }

}
