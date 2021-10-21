export class EmailAddressParser {

    // https://stackoverflow.com/questions/14440444/extract-all-email-addresses-from-bulk-text-using-jquery
    
    public static parse(text: string): ReadonlyArray<EmailAddress> {
        
        const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

        let m: RegExpExecArray | null = null;

        const result: string[] = [];

        do {

            m = re.exec(text);

            if (m) {
                result.push(m[0]);
            }

        } while (m);

        return result;

    }
    public static validateEmail(text: string): boolean {

        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(text);
    }

}

export type EmailAddress = string;
