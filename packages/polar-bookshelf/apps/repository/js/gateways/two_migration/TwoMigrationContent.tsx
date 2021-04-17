import * as React from 'react';
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {PolarSVGIcon} from "../../../../../web/js/ui/svg_icons/PolarSVGIcon";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import {MUIBrowserLinkStyle} from "../../../../../web/js/mui/MUIBrowserLinkStyle";
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import DescriptionIcon from '@material-ui/icons/Description';
import SyncIcon from '@material-ui/icons/Sync';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface FeatureProps {
    readonly title: string;
    readonly description: string;
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

                        <div style={{paddingLeft: '5px', whiteSpace: 'nowrap'}}>
                        </div>

                    </div>

            </div>

        </div>
    );

}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontSize: '1.2rem'
        },
    }),
);
export const TwoMigrationContent = deepMemo(function TwoMigrationContent() {

    const classes = useStyles();

    // link to the blog post describing our changes
    return (
        <MUIBrowserLinkStyle>
            <div className={classes.root}>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <PolarSVGIcon width={150} height={150}/>
                </div>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h1>Welcome to Polar 2.0!</h1>
                </div>

                <h2>
                    What's new in this release?
                </h2>

                <Feature title="Dark Mode"
                         description="You can now pick between light and dark mode."
                         icon={<Brightness4Icon/>}/>

                <Feature title="Cloud Only"
                         description="We're now cloud-only.  Migration from 1.0 is simple and should just take a few minutes."
                         icon={<CloudDoneIcon/>}/>

                <Feature title="EPUB Now Supported"
                         description="EPUB is now a supported document format."
                         icon={<DescriptionIcon/>}/>

                <Feature title="Improved Anki Sync"
                         description="We've improved our Anki sync support and stability."
                         icon={<SyncIcon/>}/>

                <Feature title="Keyboard Shortcuts"
                         description="We've dramatically improved our support for keyboad shortcuts."
                         icon={<KeyboardIcon/>}/>

            </div>

        </MUIBrowserLinkStyle>
    );

});
