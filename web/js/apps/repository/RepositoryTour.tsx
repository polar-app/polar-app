import Joyride from 'react-joyride';
import * as React from 'react';

export class RepositoryTour extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const steps = [
            {
                target: 'body',
                content: "Polar keeps all your documents in one place.  The document repository lists documents you've added.",
                disableBeacon: true,
            },

            {
                target: '#add-content-dropdown',
                content: 'Documents can easily be added by clicking the "Add" button and we can import documents individually or in bulk from a local directory.'
            }
            // {
            //     target: '.my-other-step',
            //     content: 'This another awesome feature!',
            // },


        ];

        // Let's take a quick tour of Polar.
        //
        //
        //
        //
        //
        //     You can login to the cloud to enable cross-device sync by clicking here.
        //
        //     Clicking on the column headers allows you to prioritize your reading queue.
        //
        //     Progress is calculated by "pagemarks" which are manually created by the user
        // during reading.
        //
        //     The added and updated columns allows you to sort by the times documents were
        // added or updated.
        //
        //     The filter bar allows you to hide/show documents in the repository.
        //
        //     Flagged documents can be used to prioritize important reading.
        //
        //     Documents can be archived once finished and are hidden by default.
        //
        // Documents can be assigned and filtered by tag.
        //
        //     You can find a document by title by searching by name.
        //
        //     Documents can be tagged by clicking here
        //
        // Documents can be flagged by clicking here
        //
        // Documents can be archived by clicking here



        return (

            <Joyride
                steps={steps}
                continuous={true}
                run={true}
                showProgress={true}
                showSkipButton={true}
                styles={{
                    options: {
                        // arrowColor: '#e3ffeb',
                        // backgroundColor: '#e3ffeb',
                        // overlayColor: 'rgba(79, 26, 0, 0.4)',
                        primaryColor: '#007bff',
                        // textColor: '#004a14',
                        // width: 900,
                        // zIndex: 1000,
                    }
                }}
            />

        );

    }

}

export interface IProps {

}

export interface IState {

}
