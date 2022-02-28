import * as React from 'react';
import Box from "@material-ui/core/Box";
import {MUIAnchor} from "../../../../web/js/mui/MUIAnchor";

export const TimeToUpgradeContent = () => {

    return (
        <div data-test-id="TimeToUpgradeContent"
             style={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>

            <Box mt={3} mb={2}>
                <UpgradeSVGIcon/>
            </Box>

            <Box mt={1}>
                <h1 style={{fontSize: '28px'}}>
                    It's Time to Upgrade
                </h1>
            </Box>

            <Box m={0}>
                <h2 style={{fontSize: '14px'}}>
                    This feature is only available in the Plus or Pro Plans.
                </h2>
            </Box>

            <Box m={1}>
                <p style={{fontSize: '14px'}}>
                    Use the coupon code <code><b>50off</b></code> in checkout to get 50% off your first month.
                </p>
            </Box>

            <Box m={2}>
                <MUIAnchor href="/settings/user-referral">
                    Student? Refer a friend, and when they sign up, you will BOTH get a free month of Polar Premium!
                </MUIAnchor>
            </Box>

            {/*<Box m={2} >*/}

            {/*    <Box m="auto" style={{display: 'flex', justifyContent: 'center'}}>*/}
            {/*        <Box m={1}>*/}
            {/*            <Button onClick={props.onCancel}>No Thanks</Button>*/}
            {/*        </Box>*/}

            {/*        <Box m={1}>*/}
            {/*            <MUIAnchorButton href="/plans"*/}
            {/*                             variant="contained"*/}
            {/*                             color="primary">View Plans</MUIAnchorButton>*/}
            {/*        </Box>*/}

            {/*    </Box>*/}
            {/*</Box>*/}

        </div>
    );
}

const SVG = `
<svg width="123" height="82" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M49.0607 0.939339C48.4749 0.353554 47.5251 0.353554 46.9393 0.939339L37.3934 10.4853C36.8076 11.0711 36.8076 12.0208 37.3934 12.6066C37.9792 13.1924 38.9289 13.1924 39.5147 12.6066L48 4.12132L56.4853 12.6066C57.0711 13.1924 58.0208 13.1924 58.6066 12.6066C59.1924 12.0208 59.1924 11.0711 58.6066 10.4853L49.0607 0.939339ZM49.5 82L49.5 2L46.5 2L46.5 82L49.5 82Z" fill="url(#paint0_linear_4660_121159)"/>
    <path d="M78.0607 29.9393C77.4749 29.3536 76.5251 29.3536 75.9393 29.9393L66.3934 39.4853C65.8076 40.0711 65.8076 41.0208 66.3934 41.6066C66.9792 42.1924 67.9289 42.1924 68.5147 41.6066L77 33.1213L85.4853 41.6066C86.0711 42.1924 87.0208 42.1924 87.6066 41.6066C88.1924 41.0208 88.1924 40.0711 87.6066 39.4853L78.0607 29.9393ZM78.5 71L78.5 31L75.5 31L75.5 71L78.5 71Z" fill="url(#paint1_linear_4660_121159)"/>
    <path d="M13.0607 14.9393C12.4749 14.3536 11.5251 14.3536 10.9393 14.9393L1.3934 24.4853C0.80761 25.0711 0.80761 26.0208 1.3934 26.6066C1.97918 27.1924 2.92893 27.1924 3.51472 26.6066L12 18.1213L20.4853 26.6066C21.0711 27.1924 22.0208 27.1924 22.6066 26.6066C23.1924 26.0208 23.1924 25.0711 22.6066 24.4853L13.0607 14.9393ZM13.5 56L13.5 16L10.5 16L10.5 56L13.5 56Z" fill="url(#paint2_linear_4660_121159)"/>
    <path d="M112.061 14.9393C111.475 14.3536 110.525 14.3536 109.939 14.9393L100.393 24.4853C99.8076 25.0711 99.8076 26.0208 100.393 26.6066C100.979 27.1924 101.929 27.1924 102.515 26.6066L111 18.1213L119.485 26.6066C120.071 27.1924 121.021 27.1924 121.607 26.6066C122.192 26.0208 122.192 25.0711 121.607 24.4853L112.061 14.9393ZM112.5 56L112.5 16L109.5 16L109.5 56L112.5 56Z" fill="url(#paint3_linear_4660_121159)"/>
    <defs>
        <linearGradient id="paint0_linear_4660_121159" x1="37.9994" y1="3.88034" x2="37.9994" y2="95.4513" gradientUnits="userSpaceOnUse">
            <stop offset="0.276042" stop-color="#6754D6"/>
            <stop offset="1" stop-color="white"/>
        </linearGradient>
        <linearGradient id="paint1_linear_4660_121159" x1="66.9994" y1="31.9402" x2="66.9994" y2="77.7257" gradientUnits="userSpaceOnUse">
            <stop offset="0.276042" stop-color="#6754D6"/>
            <stop offset="1" stop-color="white"/>
        </linearGradient>
        <linearGradient id="paint2_linear_4660_121159" x1="1.99935" y1="16.9402" x2="1.99935" y2="62.7257" gradientUnits="userSpaceOnUse">
            <stop offset="0.276042" stop-color="#6754D6"/>
            <stop offset="1" stop-color="white"/>
        </linearGradient>
        <linearGradient id="paint3_linear_4660_121159" x1="100.999" y1="16.9402" x2="100.999" y2="62.7257" gradientUnits="userSpaceOnUse">
            <stop offset="0.276042" stop-color="#6754D6"/>
            <stop offset="1" stop-color="white"/>
        </linearGradient>
    </defs>
</svg>`;

export const UpgradeSVGIcon = () => {
    return <span dangerouslySetInnerHTML={{__html: SVG}} />;
};
