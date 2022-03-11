import React, {useEffect, useState} from 'react';
import './App.css';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function createData(index: number, name: string, calories: number, fat: number, carbs: number, protein: number) {
    return {
        index,
        name: 'lorem ipsum '.repeat(20),
        calories, fat, carbs, protein,
    };
}


export function BasicTable() {
    const classes = useStyles();

    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        const rows = [];
        for (let i = 0; i < 15; i++) {
            rows.push(
                createData(i, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
            )
        }
        setRows(rows);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell align="right">Created at</TableCell>
                        <TableCell align="right">Updated at</TableCell>
                        <TableCell align="right">Progress</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.index}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function App() {
    return <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{border: '1px solid green'}}>
            <h1>Polar (dummy header)</h1>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flex: '200px 1 1', border: '1px solid red'}}>
                Dummy sidebar
            </div>
            <div style={{width: '100%'}}>
                <BasicTable/>
            </div>
        </div>
    </div>
}

export default App;
