import * as React from 'react';
import Layout from '../components/layout';
import makeStyles from '@material-ui/styles/makeStyles';
import SEO from '../components/seo';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});

const Pricing = () => {
  const classes = useStyles();

  return (
    <Layout>
      <SEO
        title='POLAR - Pricing'
        description='POLAR - Plus at $6.99 per month for 50GB of storage.'
        lang='en'
      />

      <div className={classes.root}>a few prices</div>
    </Layout>
  );
};

export default Pricing;
