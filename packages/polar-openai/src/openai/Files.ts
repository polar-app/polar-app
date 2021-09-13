/* eslint-disable camelcase */
import {Fetches} from "polar-shared/src/util/Fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export namespace Files {

    export type JSONLinesData = string;

    export type UploadPurpose = 'search' | 'answers';

    export interface IAnswerData {
        readonly text: string;
        readonly metadata?: {[key: string]: string};
    }

    export interface IUploadResponse {
        readonly id: string;
        readonly object: 'file',
        readonly bytes: number;
        readonly created_at: number;
        readonly filename: "string";
    }

    // FIXME: this is wrong as it uses multipart form data.

    export async function upload(file: ReadonlyArray<IAnswerData>, purpose: UploadPurpose) {
        const endpoint = "https://api.openai.com/v1/files";

        const data = file.map(current => JSON.stringify(current)).join("\n");

        const body = new URLSearchParams({
            file: data, purpose
        }).toString()

        await Fetches.fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body
        });

    }

}
//
// curl https://api.openai.com/v1/files \
//     -H "Authorization: Bearer ${OPENAI_API_KEY}" \
//   -F purpose="answers" \
//   -F file='@puppy.jsonl'
