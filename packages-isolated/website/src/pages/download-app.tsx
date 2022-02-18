import React from "react";
import {makeStyles} from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import Layout from "../components/layout";
import SEO from "../components/seo";

const ImgPolarLogo = require('../../content/assets/logos/logo.svg');
const AppleDownloadLogo = require('../../content/assets/logos/appstore.png');
const GoogleDownloadLogo = require('../../content/assets/logos/googleplay.png');
const PhonePreviewApple = require('../../content/assets/logos/app-preview-apple.svg');
const PhonePreviewGoogle = require('../../content/assets/logos/app-preview-google.svg');

const useStyles = makeStyles({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    nav: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#424242",
        height: '50px',
        paddingLeft: '1em',
        paddingRight: '1em',
    },
    innerContainer: {
        height: 'calc(100vh-50px)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: "column",
    },
    firstHalf: {
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1em',
    },
    secondHalf: {
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'end',
    },
    logo: {
        width: '100px',
    },
    label: {
        textAlign: 'center',
        marginLeft: '2em',
        marginRight: '2em',
        marginTop: '2em',
        marginBottom: '2em',
    },
    buttonsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2em',
    },
});

const AppleDownloadFragment: React.FC = () => {
    return <span>
                 <a href='https://apps.apple.com/us/app/polar-the-learning-app/id1572700966' target='_blank'>
                    <img src={AppleDownloadLogo} alt='Download from Apple AppStore'/>
                </a>
            </span>;
}
const AndroidDownloadFragment: React.FC = () => {
    return <span>
                <a href='https://play.google.com/store/apps/details?id=io.getpolarized.polar' target='_blank'>
                    <img src={GoogleDownloadLogo} alt='Download from Google Play Store'/>
                </a>
            </span>;
}

/**
 * Return the correct button that links to the corresponding App-store (Apple or Google)
 * @constructor
 */
const DownloadButtonFragment: React.FC = () => {
    const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    const isAndroid = navigator.userAgent.match(/Android/i);

    if (isAndroid) return <AndroidDownloadFragment/>;
    if (isIOS) return <AppleDownloadFragment/>;

    // Since we couldn't detect the device reliably, just show buttons to the two app stores
    return <>
        <AndroidDownloadFragment/>
        <AppleDownloadFragment/>
    </>
}

const ApplePreviewScreenshot = () => <img src={PhonePreviewApple} alt={'App preview screenshot'}/>;
const GooglePreviewScreenshot = () => <img src={PhonePreviewGoogle} alt={'App preview screenshot'}/>;

const DownloadApp: React.FC = () => {
    const classes = useStyles();

    const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    const isAndroid = navigator.userAgent.match(/Android/i);

    return <Layout noHeader={true}>
        <SEO
            description="Download the Polar mobile app for Android or iOS"
            title="Mobile Apps"
            lang="en"/>
        <div className={classes.wrapper}>
            <div className={classes.nav}>
                <CloseIcon onClick={() => history.back()}/>
            </div>
            <div className={classes.innerContainer}>
                <div className={classes.firstHalf}>
                    <img
                        alt={'Logo'}
                        className={classes.logo}
                        src={ImgPolarLogo}
                    />

                    <p className={classes.label}>To continue, download our updated mobile app for reading, note-taking
                        and
                        research.</p>

                    <div className={classes.buttonsWrapper}>
                        <DownloadButtonFragment/>
                    </div>
                </div>

                <div className={classes.secondHalf}>
                    {isIOS && <ApplePreviewScreenshot/>}
                    {isAndroid && <GooglePreviewScreenshot/>}
                </div>
            </div>
        </div>
    </Layout>;
}
export default DownloadApp;
