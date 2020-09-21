import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({

  root: {
      fontSize: '1.4em',
      maxWidth: '800px'
  },

});


export const PricingFAQ = React.memo(() => {

    const classes = useStyles();

    return (
        <div className={classes.root}>

            <h2 style={{textAlign: 'center'}}>
                Frequently Asked Questions
            </h2>

            <h3>How is my data stored?  Is it safe?</h3>

            <p>
                All data (your documents, notes, annotations, etc) is stored in
                our cloud infrastructure and <b>fully-encrypted</b> in transit
                and stored encrypted on our servers.
            </p>

            <h3>
                How are you handling premium users from Polar 1.0?
            </h3>

            <p>
                With Polar 2.0 we changed pricing to provide more data storage
                and all 1.0 users have been migrated to larger plans with no
                pricing increase.  We're also giving 1.0 users on the
                <i>free</i> tier an extra 1GB of storage.
            </p>

            <h3>
                Do you have enterprise pricing?
            </h3>

            <p>
                Yes.  Please reach out pricing for universities, corporations, etc.
            </p>

        </div>
    );

});
