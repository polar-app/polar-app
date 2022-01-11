import React from "react";
import {Box, Divider, makeStyles, Paper} from "@material-ui/core";
import {FATimesCircleIcon} from "../../../../web/js/mui/MUIFontAwesome";
import {PurchaseOrChangePlanButton} from "./PurchaseOrChangePlanButton";
import {PlanCheckIcon} from "./PlanCheckIcon";
import {PlanPricing} from "./PlanPricing";
import {PricingFAQ} from "./PricingFAQ";
import {PlanIntervalToggle} from "./PlanIntervalToggle";
import {usePricingStore} from "./PricingStore";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;
import V2PlanFree = Billing.V2PlanFree;

const useStyles = makeStyles({

  checkCircle: {
    maxHeight: "24px",
  },

  header: {
    fontStyle: "normal",
    fontWeight: "normal",
    // fontSize: "min(28px, 2.5vw)",
    fontSize: "28px",
    lineHeight: "33px",
    marginTop: "40px",
    // margin: "20px 0",
  },

  tableDesktop: {
    fontSize: '16px',
    margin: "10px auto 10px auto",
    mixBlendMode: "normal",
    width: "80%",
    textAlign: "center",
    borderCollapse: "collapse",
    paddingRight: "25px",
  },

  imgBox: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
  },

  buttonSignUp: {
    textTransform: "none",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    width: "9vw",
    height: "45px",
  },

  rowHead: {
    textAlign: "left",
    width: '25%',
    padding: "7px 0px 7px 60px",
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

  subtitle: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "1.2em",
    lineHeight: "1.2em",
    textAlign: "center",
    letterSpacing: "0.15px",
    color: "#E0E0E0",
    paddingBottom: "10%",
  },

});

const TableRowDivider = React.memo(function TableRowDivider() {

  const classes = useStyles();

  return (
      <tr>
        <td colSpan={5}>
          <Divider className={classes.divider} />
        </td>
      </tr>
  );

});

const DesktopTable = () => {

  const classes = useStyles();
  const {interval} = usePricingStore(['interval']);

  return (
      <Paper className={classes.tableDesktop}>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <div style={{ width: "26%" }}>
            <Box className={classes.header}>Free</Box>
            <Box className={classes.pricing}>
              <PlanPricing plan='free'/>
            </Box>
            <PurchaseOrChangePlanButton newSubscription={{plan: V2PlanFree, interval}} />
          </div>
          <div style={{ width: "26%" }}>
            <Box className={classes.header}>Plus</Box>
            <Box className={classes.pricing}>
              <PlanPricing plan='plus'/>
            </Box>
            <PurchaseOrChangePlanButton newSubscription={{plan: V2PlanPlus, interval}} />
          </div>
          <div style={{ width: "26%" }}>
            <Box className={classes.header}>Pro</Box>
            <Box className={classes.pricing}>
              <PlanPricing plan='pro'/>
            </Box>
            <PurchaseOrChangePlanButton newSubscription={{plan: V2PlanPro, interval}} />
          </div>
        </div>
        <table>
          <tbody>
          <tr className={classes.row}>
            <th></th>
            <th>Free</th>
            <th>Plus</th>
            <th>Pro</th>
          </tr>
          <TableRowDivider/>

          <tr className={classes.row}>
            <td className={classes.rowHead}>Storage</td>
            <td>1 GB</td>
            <td>50 GB</td>
            <td>500 GB</td>
          </tr>
          <TableRowDivider/>
          <tr className={classes.row}>
            <td className={classes.rowHead}>
              Maximum Captured <br /> Web Documents
            </td>
            <td>250</td>
            <td>unlimited</td>
            <td>unlimited</td>
          </tr>
          <TableRowDivider/>
          <tr className={classes.row}>
            <td className={classes.rowHead}>Devices</td>
            <td>2</td>
            <td>3</td>
            <td>unlimited</td>
          </tr>
          <TableRowDivider/>
          <tr className={classes.row}>
            <td className={classes.rowHead}>Priority Support</td>
            <td>
              <Box className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
            <td>
              <Box className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
            <td>
              <Box className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <TableRowDivider/>
          <tr className={classes.row}>
            <td className={classes.rowHead}>Related Tags</td>
            <td>
              <Box className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
            <td>
              <Box className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
            <td>
              <Box className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <TableRowDivider/>
          <tr className={classes.row}>
            <td className={classes.rowHead}>Auto-create flashcards (using GPT-3)</td>
            <td>
              <Box className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
            <td>
              100 / mo
            </td>
            <td>
              250 / mo
            </td>
          </tr>
          <TableRowDivider/>
          <tr className={classes.row}>
            <td className={classes.rowHead}>Personal onboarding by Polar team</td>
            <td>
              <Box className={classes.imgBox}>
                <FATimesCircleIcon className={classes.checkCircle} />
              </Box>
            </td>
            <td>
              <Box className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
            <td>
              <Box className={classes.imgBox}>
                <PlanCheckIcon/>
              </Box>
            </td>
          </tr>
          <tr style={{ height: "50px" }}></tr>
          </tbody>
        </table>
      </Paper>
  );
}

export const PricingContentForDesktop = () => {

  return (
      <div style={{
               display: 'flex',
               flexDirection: 'column'
           }}>

        <div style={{margin: '1em auto 1em auto'}}>
          <h1>Plans and Pricing</h1>
        </div>

        <div style={{margin: '1em auto 1em auto'}}>
          <PlanIntervalToggle/>
        </div>

        <div style={{}}>
          <DesktopTable/>
        </div>

        <div className="ml-auto mr-auto">
          <PricingFAQ/>
        </div>

      </div>
  );
}
