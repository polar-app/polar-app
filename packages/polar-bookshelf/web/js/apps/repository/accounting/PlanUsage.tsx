import React from 'react';
import {useAccountingUsage} from "./Accounting";
import {Bytes} from "polar-shared/src/util/Bytes";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {BorderLinearProgress} from "../../../mui/BorderLinearProgress";
import {Numbers} from 'polar-shared/src/util/Numbers';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Variant} from '@material-ui/core/styles/createTypography';
import {Devices} from 'polar-shared/src/util/Devices';

const useStyles = makeStyles((theme) =>
    createStyles({

        labelBox: {
            display: 'flex',
            flexDirection: 'column'
        },
        labelValue: {
            fontSize:'1em',
            flexGrow: 1,
            textAlign: 'left',
            padding: Devices.isDesktop() ? 0 : '0.3em 0'
        },
        labelValueDesc: {
            color: theme.palette.text.hint,
            fontSize: '1em',
            textAlign: 'left'
        },

        labelLimit: {
            fontSize: '1em',
            textAlign: 'right',
            padding: Devices.isDesktop() ? 0 : '0.3em 0'
        },

        labelLimitDesc: {
            color: theme.palette.text.hint,
            fontSize: '1em',
            textAlign: 'right'
        },

        progress: {
            margin: '6px 0',
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
                        Used
                    </div>
                </div>

                <div className={classes.labelBox}>
                    <div className={classes.labelLimit}>{limitStr}</div>
                    <div className={classes.labelLimitDesc}>
                        Limit
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

interface PlanUsageSizeProps {

    readonly variant?: Variant;

}

export const PlanUsage = React.memo(function PlanUsage(props: PlanUsageSizeProps) {

    const accountingUsage = useAccountingUsage();

    return (
        <>

            <Typography align="left" variant={props.variant || "h6"} color="textPrimary">
                Storage
            </Typography>

            <UsageGauge value={accountingUsage.storage.value}
                        usage={accountingUsage.storage.usage}
                        limit={accountingUsage.storage.limit}
                        type='bytes'/>

            <Box mt={1}>

                <Typography align="left" variant={props.variant || "h6"} color="textPrimary">
                    Web captures
                </Typography>

                <UsageGauge value={accountingUsage.webCaptures.value}
                            usage={accountingUsage.webCaptures.usage}
                            limit={accountingUsage.webCaptures.limit}
                            type='number'/>

            </Box>

        </>
    );

});
