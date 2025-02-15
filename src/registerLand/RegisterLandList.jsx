import { useState, useEffect } from 'react';
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import AddForm from './AddForm';
import EditForm from './EditForm';
import Skeleton from '@mui/material/Skeleton';
import config from '../config'; // Adjust the path as needed


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Hardcoded data
const initialRows = [
];
const handlePlacedOrder = (name, location) => {
  // Ensure that parameters are passed as strings
  window.location.href = `/register-land/`;
};

export default function ProductsList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState(initialRows); // Set initial state with hardcoded data
  const [loading, setLoading] = useState(true);
  const [formid, setFormid] = useState('');
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleEditOpen = () => setEditOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/registered_land`);
      const data = await response.json();
      setRows(data);
      console.log(rows)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  const deleteUser = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    setRows(rows.filter((row) => row.id !== id));
    Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      setRows(initialRows);
    }
  };

  const editData = (id, name, price, location, area) => {
    const data = { id, name, price, location, area };
    setFormid(data);
    handleEditOpen();
  };

  return (
    <>
      <div>
        <Modal
          open={open}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <AddForm closeEvent={handleClose} />
          </Box>
        </Modal>
        <Modal
          open={editopen}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <EditForm closeEvent={handleEditClose} fid={formid} />
          </Box>
        </Modal>
      </div>

      {rows.length > 0 && (
        <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
          <Typography gutterBottom variant='h5' component='div' sx={{ padding: '20px' }}>
            Register Land
          </Typography>
          <Divider />
          <Box height={10} />
          <Stack direction='row' spacing={2} className='my-2 mb-2'>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={rows}
              sx={{ width: 300 }}
              onChange={(e, v) => filterData(v)}
              getOptionLabel={(rows) => rows.name || ''}
              renderInput={(params) => (
                <TextField {...params} size='small' label='Search Registered Land' />
              )}
            />
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}></Typography>
            <Button variant='contained' endIcon={<AddCircleIcon />} onClick={() => handlePlacedOrder()}>
              Register More Land
            </Button>
          </Stack>
          <Box height={10} />
          <TableContainer>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell align='left' style={{ minWidth: '100px' }}>Land Alias</TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>Credit Points</TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>Location</TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>Area</TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>Green Cover</TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>Status</TableCell>

                  <TableCell align='left' style={{ minWidth: '100px' }}>Date</TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>{String(row.price)}</TableCell>
                    <TableCell align='left'>{row.location}</TableCell>
                    <TableCell align='left'>{row.area}</TableCell>
                    <TableCell align='left'>{row.greencover}</TableCell>
                    <TableCell align='left'>{row.status}</TableCell>
                    <TableCell align='left'>{String(row.date)}</TableCell>
                    <TableCell align='left'>
                      <Stack spacing={2} direction='row'>
                        <EditIcon
                          style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                          onClick={() => editData(row.id, row.name, row.price, row.location, row.area)}
                        />
                        <DeleteIcon
                          style={{ fontSize: '20px', color: 'darkred', cursor: 'pointer' }}
                          onClick={() => deleteUser(row.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      {rows.length === 0 && (
        <>
          <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={30} />
            <Box height={40} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
          </Paper>
        </>
      )}
    </>
  );
}
