import {DiskCache} from "./DiskCache";
import {Fetches} from "polar-shared/src/util/Fetch";

export class CacheFetches {

    public static async fetch(url: string): Promise<string> {

        const failure = await DiskCache.getFailure(url);

        if (failure) {
            throw failure;
        }

        const data = await DiskCache.get(url);

        if (data) {
            return data;
        }

        try {
            const response = await Fetches.fetch(url);

            const content = await response.text()

            await DiskCache.set(url, content);

            return content;

        } catch (e) {
            await DiskCache.markFailed(url, e);
            throw e;
        }

    }

}
