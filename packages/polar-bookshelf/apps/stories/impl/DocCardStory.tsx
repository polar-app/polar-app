import * as React from 'react';
import {DocCard} from "./doc_cards/DocCard";
import Grid from '@material-ui/core/Grid';
import { DocCardImages } from './doc_cards/DocCardImages';

const PDFCard = () => (
    <Grid item style={{flexGrow: 1, display: 'flex'}}>
        <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <DocCard title="Large Scale Cluster Management with Google Borg"
                     description="This is a description"
                     imgURL={DocCardImages.PDF_CARD_IMAGE_URL}/>
        </div>
    </Grid>
)

const WebCard = () => (
    <Grid item style={{flexGrow: 1, display: 'flex'}}>
        <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <DocCard title="Alice in Wonderland"
                     description="Alice's Adventures in Wonderland (commonly shortened to Alice in Wonderland) is an 1865 novel by English author Lewis Carroll (the pseudonym of Charles Dodgson). It tells of a young girl named Alice, who falls through a rabbit hole into a subterranean fantasy world populated by peculiar, anthropomorphic creatures"
                     imgURL={DocCardImages.WEB_CARD_IMAGE_URL}/>
        </div>
    </Grid>
)

export const DocCardStory = () => {
    return (
        <Grid container spacing={3}>

            <PDFCard/>
            <WebCard/>

            <PDFCard/>
            <WebCard/>
            <PDFCard/>
            <WebCard/>
            <PDFCard/>
            <WebCard/>
            <PDFCard/>
            <WebCard/>
            <PDFCard/>
            <WebCard/>

        </Grid>
    )
}