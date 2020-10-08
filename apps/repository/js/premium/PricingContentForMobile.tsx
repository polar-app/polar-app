import React from "react";
import {Box, Divider, makeStyles, Paper} from "@material-ui/core";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {FATimesCircleIcon} from "../../../../web/js/mui/MUIFontAwesome";
import {PremiumButton} from "./PremiumButton";
import {PlanCheckIcon} from "./PlanCheckIcon";
import {PlanPricing} from "./PlanPricing";
import {PricingFAQ} from "./PricingFAQ";
import {PlanIntervalToggle} from "./PlanIntervalToggle";
import { usePricingStore } from "./PricingStore";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;

const useStyles = makeStyles({
  checkCircle: {
    maxHeight: "24px",
  },

  headerMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    // fontSize: "min(28px, 2.5vw)",
    fontSize: "38px",
    lineHeight: "33px",
    marginTop: "30px",
    // margin: "20px 0",
  },

  imgBox: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
  },

  divider: {
    marginLeft: "4%",
    width: "92%",
  },
  row: {
    height: "55px",
    width: "65%",
  },

  pricing: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "32px",
    lineHeight: "37px",

    letterSpacing: "0.15px",

    color: "#E0E0E0",
    margin: "20px 0",
  },

  rate: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "14px",
    letterSpacing: "0.15px",
    color: "#E0E0E0",
  },

  subtitleMobile: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "19px",

    textAlign: "center",
    letterSpacing: "0.15px",
    marginTop: "5px",
    color: "#E0E0E0",
    paddingBottom: "8%",
  },

  rowHeadMobile: {
    textAlign: "left",
  },

  pricePlanMobile: {
    mixBlendMode: "normal",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    width: "340px",
    // minWidth: "300px",
    // width: "70%",
    margin: "15px",
    // paddingBottom: "5%",
    height: "705px",
  },

  tableMobile: {
    mixBlendMode: "normal",
    width: "70%",
    borderCollapse: "collapse",
    paddingRight: "25px",
    textAlign: "center",
    fontSize: "16px",
  },
});

export const PricingContentForMobile = () => {

  const {interval} = usePricingStore(['interval']);

  const classes = useStyles();
  return (
    <Box
      style={{
        display: "flex",
        // flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "40px",
      }}
    >
      <Box className={classes.pricePlanMobile}>
        <Box className={classes.pricing}> Free </Box>
        <Box className={classes.subtitleMobile}>
          Free forever
        </Box>

        <table className={classes.tableMobile}>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Updates
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Web + Desktop
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Storage
            </td>
            <td>1 GB</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Captured <br /> Web Documents
            </td>
            <td>250</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Devices
            </td>
            <td>2</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Priority Support
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
          </tr>
          {/* <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Daily <br /> Flashcard Reviews
            </td>
            <td>20</td>
          </tr> */}
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Related Tags
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
          </tr>
        </table>
      </Box>
      <Box className={classes.pricePlanMobile}>
        <Box className={classes.headerMobile}>Plus</Box>
        <Box className={classes.pricing}>
          $6.99
          <span className={classes.rate}>/mo</span>
        </Box>

        <PremiumButton newSubscription={{plan: V2PlanPlus, interval}} />

        <Box className={classes.subtitleMobile}>
          1 year commitment <br />
          gets one month free
        </Box>
        <table className={classes.tableMobile}>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Updates
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Web + Desktop
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Storage
            </td>
            <td>50 GB</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Captured <br /> Web Documents
            </td>
            <td>unlimited</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Devices
            </td>
            <td>3</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Priority Support
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          {/* <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Daily <br /> Flashcard Reviews
            </td>
            <td>unlimited</td>
          </tr> */}
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Related Tags
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
        </table>
      </Box>
      <Box className={classes.pricePlanMobile}>
        <Box className={classes.headerMobile}>Pro</Box>
        <Box className={classes.pricing}>
          $14.99
          <span className={classes.rate}>/mo</span>
        </Box>

        <PremiumButton newSubscription={{plan: V2PlanPro, interval}} />

        <Box className={classes.subtitleMobile}>
          1 year commitment <br />
          gets one month free
        </Box>
        <table className={classes.tableMobile}>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Updates
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Web + Desktop
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Storage
            </td>
            <td>500 GB</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Captured <br /> Web Documents
            </td>
            <td>unlimited</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Devices
            </td>
            <td>unlimited</td>
          </tr>
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Priority Support
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          {/* <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Maximum Daily <br /> Flashcard Reviews
            </td>
            <td>unlimited</td>
          </tr> */}
          <tr className={classes.row}>
            <td style={{ width: "50%" }} className={classes.rowHeadMobile}>
              Related Tags
            </td>
            <td>
              <Box style={{ width: "50%" }} className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
        </table>
      </Box>
    </Box>
  );
}
