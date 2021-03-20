import { makeStyles } from "@material-ui/core";

const IndexStyling = makeStyles({

  sectionOdd: {
  },

  sectionEven: {
  },

  newHeroSection: {
  },

  centerSection: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    // backgroundColor: 'rgb(78, 78, 78)',
    paddingTop: '10px',
    paddingBottom: '25px',

    "& h1": {
      fontWeight: '500',
      fontSize: '65px',
      lineHeight: '1.2em'
    },
    "& h2": {
      fontSize: '25px',
      lineHeight: '1.3em'
    },
    "& h3": {
      fontSize: '22px'
    },
    "& > *": {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '1280px'
    }

  },

  centerImage: {
    // maxHeight: '100vh',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',

    borderRadius: '10px',
    "-webkit-box-shadow": '0px 0px 10px 5px rgb(50,50,50)',
    "-moz-box-shadow": '0px 0px 10px 5px rgb(50,50,50)',
    boxShadow: "0px 0px 10px 5px rgb(50,50,50)",


  },
  topContent: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: "5.5%",
    width: "100vw",
    marginLeft: "10%",
    // paddingBottom: "2.5%",
  },
  topContentMobile: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingTop: "8.5%",
    paddingBottom: "2.5%",

    width: "100vw",
    // paddingTop: "5.5%",

    overflow: "none",
    // height: "90vh",
  },
  headerMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "900",
    fontSize: "30px",
    lineHeight: "35px",
    padding: 0,
    marginBottom: "15px",
    textAlign: "center",
    letterSpacing: "0.15px",
  },
  subtitleMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "300",
    fontSize: "16px",
    lineHeight: "18px",
    textAlign: "center",
    letterSpacing: "0.15px",
    marginBottom: "58px",
    maxWidth: "300px !important",
    margin: "0 auto",
    // width: "90%",
  },
  subtitleMobileBottom: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "300",
    fontSize: "16px",
    lineHeight: "18px",
    textAlign: "center",
    letterSpacing: "0.15px",
    // marginBottom: "38px",
    maxWidth: "300px !important",
    margin: "38px auto",
    // width: "90%",
  },

  imgMobileDimen: {
    // height: "41%",
    // width: "96%",
    marginTop: 0,
    marginBottom: 0,
    // maxWidth: "70%",
    maxHeight: "45vh",
  },
  imgDimen: {
    width: "55%",
    // height: "32.4%",
    marginRight: "10%",
  },

  imgDimenEven: {
    width: "55%",
    height: "32.4%",
    marginLeft: "10%",
  },

  hidden: {
    display: "none",
  },
  buttonAcc: {
    textTransform: "none",
    marginTop: "5%",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    // width: "17vw",
    // height: "90vh",
    width: "255px",
    height: "45px",
  },
  buttonAccMobile: {
    textTransform: "none",
    marginTop: "20%",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    width: "183px",
    height: "36.21px",
  },

  buttonAccount: {
    textTransform: "none",
    marginTop: "10px",
    marginBottom: "10px",
    backgroundColor: "#6754D6",
    width: "183px",
    height: "36.21px",
  },

  logoBar: {
    width: "36%",
    minWidth: "600px",
  },
  logoBarMobile: {
    width: "66%",
  },

  headerDesk: {
    width: "400px",
    fontSize: "40px",
  },
  marginsMobile: {
    // width: "85vw",
    // padding: "0 3%",
  },
  evenPageContent: {
    display: "flex",
    marginTop: "7.5%",
    position: "absolute",
    width: "100vw",
    // marginRight: "15%",
    // left: "0",
    right: "7%",
  },

  pageContent: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "7.5%",
    position: "absolute",
    width: "100vw",
    marginRight: "15%",
    left: "7%",
  },

  pageContentMobile: {
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",

    position: "absolute",

    margin: "0 4%",
    textAlign: "center",
    height: "90vh",
  },

  evenPageText: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    margin: "0px",
    textAlign: "right",
    left: "0",
  },

  pageText: {
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    margin: "0px",
    left: "0",
  },

  pageTextMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0px",
    left: "0",
  },

  topPageFrame: {
    display: "flex",
    flexDirection: "column",
    margin: "0",
    padding: "0",
    background: `linear-gradient(
        179.6deg,
        #6754d6 -18.13%,
        rgba(111, 93, 216, 0.948419) 8.81%,
        rgba(113, 109, 134, 0.87) 50.81%,
        rgba(255, 255, 255, 0) 80.3%
      ),
      #424242`,
    mixBlendMode: "normal",
    opacity: "0.85",
    width: "100vw",
    position: "relative",
    left: "0",
    overflowX: "hidden",
  },

  topPageFrameMobile: {
    display: "flex",
    flexDirection: "column",

    padding: "0",
    background: `linear-gradient(
        179.6deg,
        #6754d6 -18.13%,
        rgba(111, 93, 216, 0.948419) 8.81%,
        rgba(113, 109, 134, 0.87) 50.81%,
        rgba(255, 255, 255, 0) 80.3%
      ),
      #424242`,
    mixBlendMode: "normal",
    opacity: "0.85",
    width: "100vw",
    left: "0",
    overflowX: "hidden",
  },

  oddPageFrame: {
    margin: "0 auto",
    padding: "0",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",
    left: "0",
  },

  oddPageFrameMobile: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    alignItems: "center",

    padding: "0",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",
    justifyContent: "center",
    left: "0",
  },

  evenPageFrame: {
    margin: "0 auto",
    padding: "0",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",
    left: "0",
  },

  evenPageFrameMobile: {
    margin: "0 auto",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",

    left: "0",
  },

  logoFrame: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",

    paddingLeft: "3%",
    paddingRight: "3%",

    position: "relative",
    height: "400px",
  },

  logoFrameMobile: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: "0",
    paddingLeft: "4%",
    paddingRight: "2%",
    width: "100%",
    position: "relative",
    height: "40vh",
  },
});

export default IndexStyling;
