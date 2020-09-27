import React from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";
import {useAccounting, useAccountingUsage} from "./Accounting";
import {Bytes} from "polar-shared/src/util/Bytes";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

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
            height: '0.7em',
        },

    }),
);

const PlanUsageForStorage = () => {

    const classes = useStyles();
    const accountingUsage = useAccountingUsage();


    const usageStr = Bytes.format(accountingUsage.storage.value);
    const limitStr = Bytes.format(accountingUsage.storage.limit!);

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

            <LinearProgress className={classes.progress}
                            color="secondary"
                            variant="determinate"
                            value={accountingUsage.storage.usage || 0}/>

        </div>
    );

}

export const PlanUsage = () => {

    return (
        <PlanUsageForStorage/>
    );

};