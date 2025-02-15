import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Skeleton from '@mui/material/Skeleton';



import config from '../config'; // Adjust the path as needed

export default function CreditsList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/buy-credits`);
      const data = await response.json();
      setRows(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching credits:', error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handlePlacedOrder = (name,amount) => {
    // Ensure that parameters are passed as strings
    console.log('amount',amount)
  
  
  
    const transactionData = {
      sender: uuidv4(),
      receiver: uuidv4(),
      amount: amount? amount:102
    };
  
    axios.post('http://127.0.0.1:8080/add_transaction', transactionData)
      .then(response => {
        console.log('Transaction successful:', response.data);
        alert('Transaction Successful')
      })
      .catch(error => {
        console.error('Error placing transaction:', error);
      });
      console.log(transactionData);
      setRows(prevRows => prevRows.filter(row => row.name !== name));

  };
  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      fetchCredits();
    }
  };

  if (loading) {
    return (
      <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
        <Box height={20} />
        <Skeleton variant="rectangular" width={'100%'} height={30} />
        <Box height={40} />
        <Skeleton variant="rectangular" width={'100%'} height={60} />
        <Box height={20} />
        <Skeleton variant="rectangular" width={'100%'} height={60} />
        <Box height={20} />
        <Skeleton variant="rectangular" width={'100%'} height={60} />
        <Box height={20} />
        <Skeleton variant="rectangular" width={'100%'} height={60} />
        <Box height={20} />
        <Skeleton variant="rectangular" width={'100%'} height={60} />
        <Box height={20} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px' }}>
        Buy Credits
      </Typography>
      <Divider />
      <Box height={10} />
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={rows}
          sx={{ width: 300 }}
          onChange={(e, v) => filterData(v)}
          getOptionLabel={(row) => row.name || ''}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Search Registered Land" />
          )}
        />
      </Stack>
      <Box height={10} />
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: '100px' }}>Name</TableCell>
              <TableCell align="left" style={{ minWidth: '100px' }}>Price-Credits</TableCell>
              <TableCell align="left" style={{ minWidth: '100px' }}>Location</TableCell>
              <TableCell align="left" style={{ minWidth: '100px' }}>Validity</TableCell>
              <TableCell align="left" style={{ minWidth: '100px' }}>Date of Land Registration</TableCell>
              <TableCell align="left" style={{ minWidth: '100px' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.priceCredits}</TableCell>
                  <TableCell align="left">{row.location}</TableCell>
                  <TableCell align="left">{new Date(row.validity).toLocaleDateString()}</TableCell>
                  <TableCell align="left">{new Date(row.dateOfRegistration).toLocaleDateString()}</TableCell>
                  <TableCell align="left">
                  <Button variant="contained" onClick={() => {handlePlacedOrder(row.name,row.priceCredits);}}>
                      Place Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
