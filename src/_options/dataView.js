import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function DataView(props) {
    const { title, rows } = props;

    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" component="h6" sx={{ margin: '5px 10px' }}>{title}</Typography>
            <Table sx={{ minWidth: 650 }} aria-label="data table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                        {/* <TableCell sx={{ fontWeight: "bold" }} align="left">Id</TableCell> */}
                        <TableCell sx={{ fontWeight: "bold" }} align="left">Title</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="left">Sites</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="left">Search Path</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            {/* <TableCell align="left">{row.id}</TableCell> */}
                            <TableCell align="left">{row.title}</TableCell>
                            <TableCell align="left">{row.sites.map(item => (<div key={item}>{item}</div>))}</TableCell>
                            <TableCell align="left">{row.searchPath}</TableCell>
                            <TableCell align="right">
                                <IconButton aria-label="delete" color="primary" onClick={() => props.onDelete(row.id)}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}