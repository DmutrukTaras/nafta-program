import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

function MyTable({ data, lable, title }) {
    
    return (
        <div className='Table-result'>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{title[0]}</TableCell>
                            <TableCell>{title[1]}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row[lable[0]]}</TableCell>
                                <TableCell>{row[lable[1]]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default MyTable;