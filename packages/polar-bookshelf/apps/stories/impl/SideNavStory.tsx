import * as React from 'react';
import {SideNav} from "../../../web/js/sidenav/SideNav";
import {SideNavStoreProvider, TabDescriptor, useSideNavCallbacks} from "../../../web/js/sidenav/SideNavStore";
import Button from '@material-ui/core/Button';
import {DocCardImages} from "./doc_cards/DocCardImages";
import {SideNavContentRouter} from "../../../web/js/sidenav/SideNavContentRouter";
import Divider from '@material-ui/core/Divider';
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

let seq = 0;


const createWebCard = (id: string): TabDescriptor => {

    const now = ISODateTimeStrings.create();
    const url = `/apps/stories/side-nav/${id}`;

    return {

        id,
        created: now,
        lastActivated: now,
        url,
        activeURL: url,
        type: 'epub',
        title: "Alice's Adventures in Wonderland",
        icon: (
            <img src={DocCardImages.WEB_CARD_IMAGE_URL} alt='foo'/>
        ),
        image: {
            url: DocCardImages.WEB_CARD_IMAGE_URL,
            width: 200,
            height: 200
        }
    };
}


const createPDFCard = (id: string): TabDescriptor => {

    const now = ISODateTimeStrings.create();

    const url = `/apps/stories/side-nav/${id}`;

    return {

        id,
        created: now,
        lastActivated: now,
        url,
        activeURL: url,
        type: 'pdf',
        title: 'Large-scale Cluster Management at Google with Borg',
        icon: (
            <img src={DocCardImages.PDF_CARD_IMAGE_URL} alt='foo'/>
        ),
        image: {
            url: DocCardImages.PDF_CARD_IMAGE_URL,
            width: 200,
            height: 200
        }
    };

}

const createCard = (id: string) => {

    return createPDFCard(id);

    // if (id % 2 === 0) {
    //     return createPDFCard(id);
    // } else {
    //     return createWebCard(id)
    // }
}

const Body = () => {
    return (
        <div className="sidenav-body"
             style={{
                 display: 'flex',
                 flexGrow: 1
             }}>

            <div>
                <SideNav/>
            </div>

            <Divider orientation="vertical"/>

            <div style={{flexGrow: 1}}>
                <SideNavContentRouter/>
            </div>

        </div>
    )
}

const Footer = () => {

    const {addTab} = useSideNavCallbacks();

    const doAddTab = React.useCallback(() => {

        const id = seq++;
        addTab(createCard(`${id}`));

    }, [addTab]);

    return (
        <div className="sidenav-footer"
             style={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                zIndex: 1000
             }}>

            <Button color="primary"
                    variant="contained"
                    onClick={doAddTab}>
                Add Tab
            </Button>

        </div>
    );
}

export const Main = () => {


    return (
        <div className="sidenav"
             style={{
                 display: 'flex',
                 flexDirection: 'column'
             }}>

            <Body/>

            <Footer/>
        </div>
    );
}


export const SideNavStory = () => {

    return (
        <SideNavStoreProvider>
            <Main/>
        </SideNavStoreProvider>
    );
}

