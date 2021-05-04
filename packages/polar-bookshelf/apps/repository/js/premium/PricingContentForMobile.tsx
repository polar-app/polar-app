import React from "react";
import {Box, Divider, makeStyles, Paper} from "@material-ui/core";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {FATimesCircleIcon} from "../../../../web/js/mui/MUIFontAwesome";
import {PurchaseOrChangePlanButton} from "./PurchaseOrChangePlanButton";
import {PlanCheckIcon} from "./PlanCheckIcon";
import {PlanPricing} from "./PlanPricing";
import {PricingFAQ} from "./PricingFAQ";
import {PlanIntervalToggle} from "./PlanIntervalToggle";
import { usePricingStore } from "./PricingStore";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;
import {Plans} from "polar-accounts/src/Plans";
import V2Plan = Billing.V2Plan;
import V2PlanFree = Billing.V2PlanFree;

const useStyles = makeStyles({
  checkCircle: {
    maxHeight: "24px",
  },

  headerMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "38px",
    lineHeight: "33px",
    marginTop: "30px",
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
    alignItems: "center",
    width: "300px",
    margin: "5px",
  },

  tableMobile: {
    mixBlendMode: "normal",
    borderCollapse: "collapse",
    textAlign: "center",
    fontSize: "16px",
    width: '100%',
    marginLeft: '1rem',
    marginRight: '1rem',
  },
});

interface CheckRowProps {
  readonly name: string;
  readonly checked: boolean;
}

const CheckRow = (props: CheckRowProps) => {

  const classes = useStyles();

  return (
      <tr className={classes.row}>
        <td className={classes.rowHeadMobile}>
          {props.name}
        </td>
        <td>
          <Box className={classes.imgBox}>

            {props.checked && (
                <PlanCheckIcon/>
            )}

            {! props.checked && (
                <FATimesCircleIcon className={classes.checkCircle} />
            )}

          </Box>
        </td>
      </tr>

  );
}

interface PlanBoxProps {
  readonly name: string;
  readonly plan: V2Plan;
  readonly interval: Billing.Interval;
  readonly subtitle: string | React.ReactNode;
  readonly storage: string;
  readonly maxCapturedWebDocuments: number | 'unlimited';
  readonly maxDevices: number | 'unlimited';
  readonly support: boolean;
  readonly relatedTags: boolean;
  readonly autoFlashcards: number;
  readonly personalOnboarding: boolean;
}

const PlanBox = (props: PlanBoxProps) => {

  const classes = useStyles();

  return (
      <Paper elevation={1} style={{margin: '1rem'}}>

        <Box className={classes.pricePlanMobile}>
          <Box className={classes.pricing}>{props.name}</Box>
          <Box className={classes.subtitleMobile}>
            {props.subtitle}
          </Box>

          <Box className={classes.pricing}>
            <PlanPricing plan={props.plan.level}/>
          </Box>

          <PurchaseOrChangePlanButton newSubscription={{plan: props.plan, interval: props.interval}} />

          <table className={classes.tableMobile}>
            <tr className={classes.row}>
              <td className={classes.rowHeadMobile}>
                Storage
              </td>
              <td>{props.storage}</td>
            </tr>
            <tr className={classes.row}>
              <td className={classes.rowHeadMobile}>
                Maximum Captured <br /> Web Documents
              </td>
              <td>
                {props.maxCapturedWebDocuments}
              </td>
            </tr>
            <tr className={classes.row}>
              <td className={classes.rowHeadMobile}>
                Devices
              </td>
              <td>
                {props.maxDevices}
              </td>
            </tr>
            <CheckRow name="Priority Support" checked={props.support}/>
            <CheckRow name="Related Tags" checked={props.relatedTags}/>
            <tr className={classes.row}>
              <td className={classes.rowHeadMobile}>
                Auto-create flashcards (using GPT-3)
              </td>
              <td>
                {
                  props.autoFlashcards > 0
                    ? `${props.autoFlashcards} / ${props.interval}`
                    : <FATimesCircleIcon className={classes.checkCircle} />
                }
              </td>
            </tr>

            <CheckRow name="Personal onboarding by Polar team" checked={props.personalOnboarding}/>
          </table>
        </Box>
      </Paper>
  );
}

export const PricingContentForMobile = () => {

  const {interval} = usePricingStore(['interval']);

  return (
    <Box
      style={{
        display: "flex",
        // flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "40px",
      }}>

      <div style={{margin: '1em auto 1em auto'}}>
        <PlanIntervalToggle/>
      </div>

      <PlanBox name="Free"
               plan={V2PlanFree}
               interval={interval}
               subtitle="Free Forever"
               storage="1 GB"
               maxCapturedWebDocuments={250}
               maxDevices={2}
               support={false}
               relatedTags={false}
               autoFlashcards={0}
               personalOnboarding={false} />

      <PlanBox name="Plus"
               plan={V2PlanPlus}
               interval={interval}
               subtitle={<>1 year commitment <br /> gets one month free</>}
               storage="50 GB"
               maxCapturedWebDocuments="unlimited"
               maxDevices="unlimited"
               support={true}
               relatedTags={true}
               autoFlashcards={100}
               personalOnboarding={true} />

      <PlanBox name="Pro"
               plan={V2PlanPro}
               interval={interval}
               subtitle={<>1 year commitment <br /> gets one month free</>}
               storage="500 GB"
               maxCapturedWebDocuments="unlimited"
               maxDevices="unlimited"
               support={true}
               relatedTags={true}
               autoFlashcards={250}
               personalOnboarding={true} />

    </Box>
  );
}
