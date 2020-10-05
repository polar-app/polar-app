import * as React from 'react';
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {PolarSVGIcon} from "../../../../../web/js/ui/svg_icons/PolarSVGIcon";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import {MUIBrowserLinks} from "../../../../../web/js/mui/MUIBrowserLinks";
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import DescriptionIcon from '@material-ui/icons/Description';
import SyncIcon from '@material-ui/icons/Sync';
import KeyboardIcon from '@material-ui/icons/Keyboard';

interface FeatureProps {
    readonly title: string;
    readonly description: string;
    readonly link: string;
    readonly icon: React.ReactNode;
}

const Feature = (props: FeatureProps) => {

    return (
        <div style={{
                 display: 'flex',
                 alignItems: 'top',
                 marginBottom: '1em'
             }}>

            <div>
                {props.icon}
            </div>

            <div style={{paddingLeft: '1em', flexGrow: 1}}>

                    <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                        {props.title}
                    </div>

                    <div style={{display: 'flex'}}>

                        <div style={{flexGrow: 1}}>
                            {props.description}
                        </div>

                        <div style={{paddingLeft: '5px'}}>
                            <a href={props.link}>Read more</a>
                        </div>

                    </div>

            </div>

        </div>
    );

}

export const TwoMigrationContent = deepMemo(() => {

    return (
        <MUIBrowserLinks>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <PolarSVGIcon width={150} height={150}/>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <h1>Welcome to Polar 2.0!</h1>
            </div>

            <p>
                What's new in this release?
            </p>

            <Feature title="Dark Mode"
                     description="You can now pick between light and dark mode."
                     link="none"
                     icon={<Brightness4Icon/>}/>

            <Feature title="Cloud Only"
                     description="We're now cloud-only.  Migration from 1.0 is simple and should just take a few minutes."
                     link="none"
                     icon={<CloudDoneIcon/>}/>

            <Feature title="EPUB Now Supported"
                     description="EPUB is now a supported document format."
                     link="none"
                     icon={<DescriptionIcon/>}/>

            <Feature title="Improved Anki Sync"
                     description="We've improved our Anki sync support and stability."
                     link="none"
                     icon={<SyncIcon/>}/>

            <Feature title="Keyboard Shortcuts"
                     description="We've dramatically improved our support for keyboad shortcuts."
                     link="none"
                     icon={<KeyboardIcon/>}/>

        </MUIBrowserLinks>
    );

});
