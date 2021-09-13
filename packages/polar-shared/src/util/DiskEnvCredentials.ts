import {PathStr} from "./Strings";
import os from 'os';
import fs from 'fs';

import {Paths} from "./Paths";

export namespace DiskEnvCredentials {


    /**
     * Read credentials from the environment, if they don't exist use the defaultCredentials,
     * and then return a path to where they are written.
     *
     */
    export function write(envKey: string, defaultCredentials: any): PathStr {

        const envCredentials = process.env[envKey];

        const credentials = envCredentials || defaultCredentials;

        const tmpdir = os.tmpdir();

        const rnd = Math.random() * 10000;
        const path = Paths.join(tmpdir, `${rnd}.json`);

        fs.writeFileSync(path, JSON.stringify(credentials, null, "  "));

        return path;

    }

}
