import {Arrays} from "polar-shared/src/util/Arrays";

interface ILinks {
    // the calendly for the user email for a user interview post subscription.
    readonly userInterviewForPro: string;
}

export interface IPersona {
    readonly firstName: string;
    readonly role: 'founder',
    readonly email: string;
    readonly links: ILinks;
    // readonly
}

export namespace Personas {

    const backing: ReadonlyArray<IPersona> = [
        {
            firstName: 'Kevin',
            role: 'founder',
            email: 'burton@getpolarized.io',
            links: {
                userInterviewForPro: ''
            }
        },
        {
            firstName: 'Jonathan',
            role: 'founder',
            email: 'jonathan@getpolarized.io',
            links: {
                userInterviewForPro: 'https://calendly.com/jonathanpolarized/30min'
            }
        }
    ];

    export function random(): IPersona {
        return Arrays.shuffle(...backing)[0]
    }

}