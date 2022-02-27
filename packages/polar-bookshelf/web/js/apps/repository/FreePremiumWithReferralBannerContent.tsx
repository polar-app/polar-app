import React from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Box from "@material-ui/core/Box";

interface IProps {
    readonly onClose: () => void;
}

export const FreePremiumWithReferralBannerContent = (props: IProps) => {

    const theme = useTheme();

    return (
        <div style={{
                 padding: theme.spacing(0.5),
                 backgroundColor: theme.palette.primary.main,
                 color: theme.palette.primary.contrastText,
                 textAlign: 'center',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: "center"
             }}>

            {/*HACK to create a spacer in the DOM */}
            <Box style={{visibility: 'hidden'}}>
                <IconButton size="small">
                    <CloseIcon/>
                </IconButton>
            </Box>

            <div style={{display: 'flex', justifyContent: "center", textAlign: 'center', flexGrow: 1}}>
                <a href="/"
                   style={{color: theme.palette.primary.contrastText}}>Invite Friends to Polar!</a>
                &nbsp;
                For every new referral sign up you refer you'll get a free month of Polar Premium
            </div>

            <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
                <IconButton size="small" onClick={props.onClose}>
                    <CloseIcon/>
                </IconButton>
            </Box>

        </div>
    )
}

// For every new referral sign up you refer you'll get a free month of Polar Premium
// Get one free month of Polar Premium when you refer your friends!
