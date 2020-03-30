// Imports the Google Cloud Tasks library.
import {CloudTasksClient} from '@google-cloud/tasks';
import {URLStr} from "polar-shared/src/util/Strings";
import {google} from "@google-cloud/tasks/build/protos/protos";
import HttpMethod = google.cloud.tasks.v2beta3.HttpMethod;

// Instantiates a client.
const client = new CloudTasksClient();

const project = 'polar-32b0f';
const queue = 'doc-preview';
const location = 'us-central1';

export class SendToQueue {

    public static async send(url: URLStr, headers: {[key: string]: string} = {}) {

        // const url = 'https://app.getpolarized.io/doc-preview-import/https://www.jstage.jst.go.jp/article/jmsjmag/18/S_1_PMRC_94_1/18_S_1_PMRC_94_1_S1_179/_pdf';
        // const payload = 'Hello, World!';

        // Construct the fully qualified queue name.
        const parent = client.queuePath(project, location, queue);

        const task = {
            httpRequest: {
                // TODO: we shouldn't assume GET by default
                httpMethod: HttpMethod.GET,
                url,
                headers
            },
        };

        // Send create task request.
        // console.log('Sending task:');
        // console.log(task);
        const request = {parent, task};
        const [response] = await client.createTask(request);
        console.log(`Created task ${response.name}`);

    }

}
