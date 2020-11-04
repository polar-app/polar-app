import * as React from 'react';
import {SideNav} from "../../../web/js/sidenav/SideNav";
import {SideNavStoreProvider, useSideNavCallbacks} from "../../../web/js/sidenav/SideNavStore";
import Button from '@material-ui/core/Button';
import {DocCardImages} from "./doc_cards/DocCardImages";
import {SideNavContent} from "../../../web/js/sidenav/SideNavContent";

let seq = 0;

export const Main = () => {

    const {addTab} = useSideNavCallbacks();

    const doAddTab = React.useCallback(() => {

        seq = seq + 1;

        const id = seq;

        addTab({
            id,
            url: `http://example.com/${id}`,
            title: 'this is the title',
            icon: (
                <img src={DocCardImages.WEB_CARD_IMAGE_URL} alt='foo'/>
            ),
            content: (
                <div>this is the content for tab {id}</div>
            ),
            image: {
                url: DocCardImages.WEB_CARD_IMAGE_URL,
                width: 200,
                height: 200
            }
        });

    }, [addTab]);

    return (
        <div style={{
                 display: 'flex',
                 flexDirection: 'column'
            }}>

            <div style={{
                     display: 'flex',
                     flexGrow: 1
                }}>
                <SideNav/>
                <SideNavContent/>
            </div>
            <div style={{}}>

                <Button color="primary"
                        variant="contained"
                        onClick={doAddTab}>
                    Add Tab
                </Button>

            </div>
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

