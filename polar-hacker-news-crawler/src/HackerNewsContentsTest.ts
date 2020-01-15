import {Files} from "polar-shared/src/util/Files";
import {HackerNewsContents} from "./HackerNewsContents";

describe('HackerNewsContents', function() {

    it("basic", async function () {

        const path = '/Users/burton/projects/polar-app/packages/polar-app-private/polar-hacker-news-crawler/src/hacker-news.html';

        const buff = await Files.readFileAsync(path);

        const content = buff.toString('utf-8');

        HackerNewsContents.parse(content);

    });

});
