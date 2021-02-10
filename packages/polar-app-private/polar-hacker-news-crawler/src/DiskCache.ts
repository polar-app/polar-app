import {Files} from "polar-shared/src/util/Files";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

const DIR = '/tmp/polar-hacker-news-cache';
const ENC = 'utf-8';

export class DiskCache {

    public static async get(url: string, suffix: string = 'dat'): Promise<string | undefined> {

        const path = this.computePath(url, suffix);

        if (await Files.existsAsync(path)) {
            const data = await Files.readFileAsync(path);
            return data.toString(ENC);
        }

        return undefined;

    }

    public static async set(url: string, content: string) {

        const path = this.computePath(url);
        await Files.createDirAsync(DIR);
        await Files.writeFileAsync(path, content, {encoding: ENC});

    }

    public static async getFailure(url: string) {

        const data = await this.get(url, 'err');

        if (data) {
            const obj = JSON.parse(data);
            return new Error(obj.message);
        }

        return undefined;

    }

    public static async markFailed(url: string, err: Error) {

        const path = this.computePath(url, 'err');

        const content = {
            msg: err.message
        };

        await Files.createDirAsync(DIR);
        await Files.writeFileAsync(path, JSON.stringify(content), {encoding: ENC});

    }

    private static computePath(url: string, suffix: string = 'dat') {
        const key = Hashcodes.create(url).substr(0, 10);
        return `${DIR}/${key}.${suffix}`;
    }

}

