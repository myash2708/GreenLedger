import React from 'react';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import RegisterLandList from '../registerLand/RegisterLandList';

export default function RegisterLand() {
  return (
    <>
      <div className='bgcolor'>
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
            <RegisterLandList />
          </Box>
        </Box>
      </div>
    </>
  );
}
