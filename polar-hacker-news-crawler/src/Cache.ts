import {Files} from "polar-shared/src/util/Files";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

const DIR = '/tmp/polar-hacker-news-cache';
const ENC = 'utf-8';

export class Cache {

    public static async get(url: string): Promise<string | undefined> {

        const path = this.computePath(url);

        if (await Files.existsAsync(path)) {
            const data = await Files.readFileAsync(path);
            return data.toString(ENC);
        }

        return undefined;

    }

    public static async set(url: string, content: string) {

        await Files.createDirAsync(DIR);

        const path = this.computePath(url);
        await Files.writeFileAsync(path, content, {encoding: ENC});

    }

    private static computePath(url: string) {
        const key = Hashcodes.create(url).substr(0, 10);
        return `${DIR}/${key}.dat`;
    }

}
