
import {parseAddressList} from 'email-addresses';
import ParsedMailbox = emailAddresses.ParsedMailbox;
import {Optional} from './ts/Optional';

/**
 * This is an RFC 5322 parser.
 */
export class EmailAddresses {

    public static parseList(input: string) {

        const parsed = parseAddressList(input);

        const result: EmailAddress[] = [];

        for (const current of parsed) {

            if (current.type === 'mailbox') {
                const parsedMailbox = <ParsedMailbox> <any> current;
                const name = Optional.of(parsedMailbox.name).getOrUndefined();
                const address = parsedMailbox.address;
                result.push({name, address});
            }

        }

        return result;

    }

}

export interface EmailAddress {
    readonly name?: string;
    readonly address: string;
}
