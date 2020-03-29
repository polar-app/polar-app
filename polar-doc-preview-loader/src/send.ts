// Imports the Google Cloud Tasks library.
import {CloudTasksClient} from '@google-cloud/tasks';

async function doExec() {

    // Instantiates a client.
    const client = new CloudTasksClient();

    const project = 'polar-32b0f';
    const queue = 'doc-preview';
    const location = 'us-central1';
    const url = 'https://app.getpolarized.io/doc-preview-import/https://www.jstage.jst.go.jp/article/jmsjmag/18/S_1_PMRC_94_1/18_S_1_PMRC_94_1_S1_179/_pdf';
    // const payload = 'Hello, World!';

    // Construct the fully qualified queue name.
    const parent = client.queuePath(project, location, queue);

    const task = {
        httpRequest: {
            // httpMethod: "GET",
            url,
        },
    };

    // if (payload) {
    //     task.httpRequest.body = Buffer.from(payload).toString('base64');
    // }

    // if (inSeconds) {
    //     // The time when the task is scheduled to be attempted.
    //     task.scheduleTime = {
    //         seconds: inSeconds + Date.now() / 1000,
    //     };
    // }

    // Send create task request.
    console.log('Sending task:');
    console.log(task);
    const request = {parent, task};
    const [response] = await client.createTask(request);
    console.log(`Created task ${response.name}`);

}


doExec().catch(err => console.error(err));
