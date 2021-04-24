import React from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";
import {useAccounting, useAccountingUsage} from "./Accounting";
import {Bytes} from "polar-shared/src/util/Bytes";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {BorderLinearProgress} from "../../../mui/BorderLinearProgress";
import { Numbers } from 'polar-shared/src/util/Numbers';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) =>
    createStyles({

        labelBox: {
            display: 'flex',
            flexDirection: 'column'
        },
        labelValue: {
            fontSize: '2.5em',
            flexGrow: 1,
            textAlign: 'left'
        },
        labelValueDesc: {
            color: theme.palette.text.hint,
            textAlign: 'left'
        },

        labelLimit: {
            fontSize: '2.5em',
            color: theme.palette.text.hint,
            textAlign: 'right'
        },

        labelLimitDesc: {
            color: theme.palette.text.hint,
            textAlign: 'right'
        },

        progress: {
            marginTop: '2px',
            marginBottom: '2px',
            height: '0.7em',
        },

    }),
);

interface UsageGaugeProps {

    readonly value: number;
    readonly usage: number | undefined;
    readonly limit: number | undefined;

    readonly type: 'bytes' | 'number';

}

const UsageGauge = React.memo(function UsageGauge(props: UsageGaugeProps) {

    const classes = useStyles();

    const formatValue = React.useCallback((value: number) => {

        switch(props.type) {
            case "bytes":
                return Bytes.format(value)
            case "number":
                return Numbers.format(value);

        }

    }, [props.type]);

    const usageStr = formatValue(props.value);
    const limitStr = props.limit === undefined ? 'unlimited' : formatValue(props.limit);

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <div style={{display: 'flex'}}>

                <div className={classes.labelBox}
                     style={{flexGrow: 1}}>
                    <div className={classes.labelValue}>
                        {usageStr}
                    </div>
                    <div className={classes.labelValueDesc}>
                        USED
                    </div>
                </div>

                <div className={classes.labelBox}>
                    <div className={classes.labelLimit}>{limitStr}</div>
                    <div className={classes.labelLimitDesc}>
                        LIMIT
                    </div>
                </div>

            </div>

            <BorderLinearProgress className={classes.progress}
                                  color="primary"
                                  variant="determinate"
                                  value={props.usage || 0}/>

        </div>
    );

});
//
// const PlanUsageForStorage = React.memo(function PlanUsageForStorage() {
//
//     const classes = useStyles();
//
//     const accountingUsage = useAccountingUsage();
//
//     const usageStr = Bytes.format(accountingUsage.storage.value);
//     const limitStr = Bytes.format(accountingUsage.storage.limit!);
//
//     return (
//         <div style={{display: 'flex', flexDirection: 'column'}}>
//
//             <div style={{display: 'flex'}}>
//
//                 <div className={classes.labelBox}
//                      style={{flexGrow: 1}}>
//                     <div className={classes.labelValue}>
//                         {usageStr}
//                     </div>
//                     <div className={classes.labelValueDesc}>
//                         USED
//                     </div>
//                 </div>
//
//                 <div className={classes.labelBox}>
//                     <div className={classes.labelLimit}>{limitStr}</div>
//                     <div className={classes.labelLimitDesc}>
//                         LIMIT
//                     </div>
//                 </div>
//
//             </div>
//
//             <BorderLinearProgress className={classes.progress}
//                                   color="primary"
//                                   variant="determinate"
//                                   value={accountingUsage.storage.usage || 0}/>
//
//         </div>
//     );
//
// });

export const PlanUsage = () => {

    const accountingUsage = useAccountingUsage();

    return (
        <>

            <Typography align="left" variant="h6" color="textSecondary">
                Storage
            </Typography>

            <UsageGauge value={accountingUsage.storage.value}
                        usage={accountingUsage.storage.usage}
                        limit={accountingUsage.storage.limit}
                        type='bytes'/>

            <Box mt={1}>

                <Typography align="left" variant="h6" color="textSecondary">
                    Web captures
                </Typography>

                <UsageGauge value={accountingUsage.webCaptures.value}
                            usage={accountingUsage.webCaptures.usage}
                            limit={accountingUsage.webCaptures.limit}
                            type='number'/>

            </Box>

        </>
    );

};
