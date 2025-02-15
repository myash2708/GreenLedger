import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const calculateAQI = (
  ozone,
  particlePollution,
  carbonMonoxide,
  sulfurDioxide,
  nitrogenDioxide
) => {
  const getAQISubIndex = (C, breakpoints) => {
    for (let i = 0; i < breakpoints.length - 1; i++) {
      const [C_lo, C_hi, I_lo, I_hi] = breakpoints[i];
      if (C >= C_lo && C <= C_hi) {
        return ((I_hi - I_lo) / (C_hi - C_lo)) * (C - C_lo) + I_lo;
      }
    }
    return 0;
  };

  const ozoneBreakpoints = [
    [0, 54, 0, 50],
    [55, 70, 51, 100],
    [71, 85, 101, 150],
    [86, 105, 151, 200],
    [106, 200, 201, 300],
  ];

  const particlePollutionBreakpoints = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
  ];

  const carbonMonoxideBreakpoints = [
    [0, 4.4, 0, 50],
    [4.5, 9.4, 51, 100],
    [9.5, 12.4, 101, 150],
    [12.5, 15.4, 151, 200],
    [15.5, 30.4, 201, 300],
  ];

  const sulfurDioxideBreakpoints = [
    [0, 35, 0, 50],
    [36, 75, 51, 100],
    [76, 185, 101, 150],
    [186, 304, 151, 200],
    [305, 604, 201, 300],
  ];

  const nitrogenDioxideBreakpoints = [
    [0, 53, 0, 50],
    [54, 100, 51, 100],
    [101, 360, 101, 150],
    [361, 649, 151, 200],
    [650, 1249, 201, 300],
  ];

  return Math.max(
    getAQISubIndex(ozone, ozoneBreakpoints),
    getAQISubIndex(particlePollution, particlePollutionBreakpoints),
    getAQISubIndex(carbonMonoxide, carbonMonoxideBreakpoints),
    getAQISubIndex(sulfurDioxide, sulfurDioxideBreakpoints),
    getAQISubIndex(nitrogenDioxide, nitrogenDioxideBreakpoints)
  );
};

export default function History() {
  const { landId } = useParams();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchHistoryData();
  }, [landId]);

  const fetchHistoryData = () => {
    // Replace this with an actual API call
    const dummyHistoryData = [
      {
        date: '2024-07-01',
        ozone: 70,
        particlePollution: 55,
        carbonMonoxide: 9,
        sulfurDioxide: 75,
        nitrogenDioxide: 100,
      },
      {
        date: '2024-06-30',
        ozone: 65,
        particlePollution: 50,
        carbonMonoxide: 8,
        sulfurDioxide: 70,
        nitrogenDioxide: 90,
      },
      {
        date: '2024-06-29',
        ozone: 55,
        particlePollution: 45,
        carbonMonoxide: 7,
        sulfurDioxide: 65,
        nitrogenDioxide: 80,
      },
      {
        date: '2024-06-28',
        ozone: 50,
        particlePollution: 40,
        carbonMonoxide: 6,
        sulfurDioxide: 60,
        nitrogenDioxide: 70,
      },
    ];
    dummyHistoryData.forEach((entry, index, array) => {
      entry.aqi = calculateAQI(
        entry.ozone,
        entry.particlePollution,
        entry.carbonMonoxide,
        entry.sulfurDioxide,
        entry.nitrogenDioxide
      );
      entry.flagged = index > 0 && entry.aqi < array[index - 1].aqi - 20;
    });
    setHistoryData(dummyHistoryData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBack = () => {
    navigate('/monitoringlogs');
  };

  return (
    <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
      <Typography
        gutterBottom
        variant='h5'
        component='div'
        sx={{ padding: '20px' }}
      >
        History of Land {landId}
      </Typography>
      <Button variant='outlined' onClick={handleBack} sx={{ marginBottom: 2 }}>
        Back to Monitoring Logs
      </Button>
      <Divider />
      <TableContainer sx={{ marginTop: 2 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Ozone</TableCell>
              <TableCell>Particle Pollution</TableCell>
              <TableCell>Carbon Monoxide</TableCell>
              <TableCell>Sulfur Dioxide</TableCell>
              <TableCell>Nitrogen Dioxide</TableCell>
              <TableCell>AQI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  key={row.date}
                  sx={{
                    backgroundColor: row.flagged ? '#ffebee' : 'inherit',
                  }}
                >
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.ozone}</TableCell>
                  <TableCell>{row.particlePollution}</TableCell>
                  <TableCell>{row.carbonMonoxide}</TableCell>
                  <TableCell>{row.sulfurDioxide}</TableCell>
                  <TableCell>{row.nitrogenDioxide}</TableCell>
                  <TableCell>{row.aqi}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={historyData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
