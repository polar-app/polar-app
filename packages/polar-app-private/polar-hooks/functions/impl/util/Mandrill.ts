import {Fetches} from "polar-shared/src/util/Fetch";

const KEY = "1wn8QiClhFH5gCrElLqaNQ";

export class Mandrill {

    // https://mandrillapp.com/api/docs/messages.JSON.html

    // call the template 'document_shared' with title, sender, link

    public static async sendDocumentShared(from: EmailAddress,
                                           to: ReadonlyArray<EmailAddress>,
                                           tTitle: string,
                                           tSender: string,
                                           tLink: string) {

        return this.send(from, to, 'document_shared', {tTitle, tSender, tLink});

    }

    private static async send(from: EmailAddress,
                              to: ReadonlyArray<EmailAddress>,
                              templateName: string,
                              globalMergeVars: {[name: string]: string}) {

        // need a way for the user to disable emails... s

        const url = 'https://mandrillapp.com/api/1.0/messages/send-template.json';

        // tslint:disable-next-line:variable-name
        const global_merge_vars = Object.entries(globalMergeVars).map(entry => {
            return {
                name: entry[0],
                content: entry[1]
            };
        });

        const body = {
            key: KEY,
            template_name: templateName,
            template_content: [],
            message: {
                from_email: from.email,
                from_name: from.name,
                to,
                merge_language: 'handlebars',
                global_merge_vars
            }
        };

        const init = {
            method: 'POST',
            body: JSON.stringify(body)
        };

        const response = await Fetches.fetch(url, init);

        if (response.status !== 200) {
            // console.log(await response.text());
            throw new Error("Failed request: " + response.status + ": " + response.statusText);
        }

        const results: MandrillSendResults = await response.json();

        const result = results[0];

        if (result.status !== 'sent') {
            throw new Error("Failed to send: " + result.reject_reason);
        }

    }

}

export interface EmailAddress {
    readonly email: string;
    readonly name?: string;
    readonly type?: 'to' | 'cc' | 'bcc';
}

export type MandrillSendResults = ReadonlyArray<MandrillSendResult>;

export interface MandrillSendResult {
    readonly email: string;
    readonly status: 'sent' | 'rejected';
    readonly reject_reason: string;
}
