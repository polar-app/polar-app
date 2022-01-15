import {Arrays} from "polar-shared/src/util/Arrays";

interface IFounderPersonaLinks {
    // the calendly for the user email for a user interview post subscription.
    readonly userInterviewForPro: string;
}

export interface IFounderPersona {
    readonly firstName: string;
    readonly role: 'founder',
    readonly email: string;
    readonly links: IFounderPersonaLinks;
}

export namespace FounderPersonas {

    const backing: ReadonlyArray<IFounderPersona> = [
        {
            firstName: 'Kevin',
            role: 'founder',
            email: 'burton@getpolarized.io',
            links: {
                userInterviewForPro: 'https://calendly.com/kevinburton415/polar-premium-user-interview?back=1&month=2020-12'
            }
        },
        {
            firstName: 'Jonathan',
            role: 'founder',
            email: 'jonathan@getpolarized.io',
            links: {
                userInterviewForPro: 'https://calendly.com/jonathangraeupner/30min'
            }
        }
    ];

    export function random(): IFounderPersona {
        return Arrays.shuffle(...backing)[0]
    }

}
