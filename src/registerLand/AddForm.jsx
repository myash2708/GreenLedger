import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import Swal from 'sweetalert2';
import { useAppStore } from '../appStore';

export default function AddForm({ closeEvent }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [document, setDocument] = useState(null);
  const empCollectionRef = collection(db, 'products');
  const setRows = useAppStore((state) => state.setRows);

  const createUser = async () => {
    const docUrl = await uploadDocument();
    await addDoc(empCollectionRef, {
      name: name,
      price: Number(price),
      location: location,
      document: docUrl,
      date: String(new Date()),
    });
    getUsers();
    closeEvent();
    
    // Swal.fire('Submitted!', 'Your file has been submitted.', 'success');
  };

  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const currencies = [
    {
      value: 'Village',
      label: 'Village',
    },
    {
      value: 'Forest',
      label: 'Forest',
    },
    {
      value: 'SubUrban',
      label: 'SubUrban',
    },
    {
      value: 'Urban',
      label: 'Urban',
    },
  ];

  const handleNameChange = (event) => {
    setName(event.target.value);
  };




  const handleDocumentChange = (event) => {
    setDocument(event.target.files[0]);
  };

  const uploadDocument = async () => {
    if (!document) return '';
    const formData = new FormData();
    formData.append('file', document);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.fileUrl;
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant='h5' align='center'>
        Register Land
      </Typography>
      <IconButton
        style={{ position: 'absolute', top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={false}
            id='name'
            name='name'
            value={name}
            onChange={handleNameChange}
            label='Land Alias'
            size='small'
            sx={{ marginTop: '30px', minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={false}
            id='name'
            name='name'
            value={name}
            onChange={handleNameChange}
            label='Address'
            size='small'
            sx={{ minWidth: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={false}
            id='name'
            name='name'
            value={name}
            onChange={handleNameChange}
            label='Pincode'
            size='small'
            sx={{ minWidth: '50%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={false}
            id='name'
            name='name'
            value={name}
            onChange={handleNameChange}
            label='State'
            size='small'
            sx={{ minWidth: '50%' }}
          />
        </Grid>

        {/* <Grid item xs={6}>
          <TextField
            error={false}
            id='price'
            label='Price'
            type='number'
            value={price}
            onChange={handlePriceChange}
            size='small'
            sx={{ minWidth: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid> */}
        {/* <Grid item xs={6}>
          <TextField
            error={false}
            id='category'
            label='Category'
            select
            value={category}
            onChange={handleCategoryChange}
            size='small'
            sx={{ minWidth: '100%' }}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid> */}
        <Grid item xs={6}>
          <Button
            variant='contained'
            component='label'
            color='secondary'
            sx={{ minWidth: '100%', marginBottom: '15px' }}
          >
            Upload Document
            <input type='file' hidden onChange={handleDocumentChange} />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => window.location.href('https://example.com/demo-video', '_blank')}
            sx={{ minWidth: '100%', marginBottom: '15px' }}
          >
            Video Verification
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant='contained'
            onClick={createUser}
            sx={{ minWidth: '100%' }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
