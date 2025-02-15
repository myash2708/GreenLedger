import React from 'react';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import MonitoringLogs from '../monitoringLogs/MonitoringLogs';

export default function Products() {
  return (
    <>
      <div className='bgcolor'>
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
            <MonitoringLogs />
          </Box>
        </Box>
      </div>
    </>
  );
}
