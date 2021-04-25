import * as React from 'react';
import Box from '@material-ui/core/Box';

interface IParameter {
    readonly name: string;
    readonly description: string;
}

interface MandrillTemplate {

    readonly name: string;
    readonly description: string;

    readonly parameters: ReadonlyArray<IParameter>;

}


const templates: ReadonlyArray<MandrillTemplate> = [
    {
        name: 'premium-thank-you',
        description: "Thank you email once the user has gone premium.",
        parameters: [

        ]
    }
]

export const MandrillStory = () => {

    return (
        <div>
            <h1>
                Test Sending Templated Mandrill Emails.
            </h1>

            <Box mt={1} mb={1}>



            </Box>

        </div>
    );

}