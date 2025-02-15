import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

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

export default function MonitoringLogs() {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = () => {
    setLoading(false);
    const landData = [
      {
        id: '1',
        name: 'Land 1',
        photoUrl: '/trees.jpg',
        ozone: 70,
        particlePollution: 55,
        carbonMonoxide: 9,
        sulfurDioxide: 75,
        nitrogenDioxide: 100,
        history: [
          { date: '2024-07-01', aqi: 150 },
          { date: '2024-07-02', aqi: 120 },
          { date: '2024-07-03', aqi: 80 },
        ],
      },
      {
        id: '2',
        name: 'Land 2',
        photoUrl: '/trees2.jpg',
        ozone: 60,
        particlePollution: 25,
        carbonMonoxide: 15,
        sulfurDioxide: 5,
        nitrogenDioxide: 35,
        history: [
          { date: '2024-07-01', aqi: 60 },
          { date: '2024-07-02', aqi: 55 },
          { date: '2024-07-03', aqi: 50 },
        ],
      },
      {
        id: '3',
        name: 'Land 3',
        photoUrl: '/trees3.jpg',
        ozone: 50,
        particlePollution: 20,
        carbonMonoxide: 10,
        sulfurDioxide: 20,
        nitrogenDioxide: 30,
        history: [
          { date: '2024-07-01', aqi: 70 },
          { date: '2024-07-02', aqi: 90 },
          { date: '2024-07-03', aqi: 60 },
        ],
      },
    ];
    landData.forEach((land) => {
      land.aqi = calculateAQI(
        land.ozone,
        land.particlePollution,
        land.carbonMonoxide,
        land.sulfurDioxide,
        land.nitrogenDioxide
      );
      land.flagged = land.history.some((entry, index, array) => {
        if (index > 0) {
          return entry.aqi < array[index - 1].aqi - 20;
        }
        return false;
      });
    });
    setLands(landData);
  };

  const filterData = (v) => {
    setSelectedLand(v);
  };

  const handleSeeHistory = (land) => {
    navigate(`/history/${land.id}`);
  };

  return (
    <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
      <Typography
        gutterBottom
        variant='h5'
        component='div'
        sx={{ padding: '20px' }}
      >
        Monitoring logs of previously registered lands
      </Typography>
      <Divider />
      <Box height={10} />
      <Autocomplete
        disablePortal
        id='combo-box-demo'
        options={lands}
        sx={{ width: 300, marginBottom: 2 }}
        onChange={(e, v) => filterData(v)}
        getOptionLabel={(land) => land.name || ''}
        renderInput={(params) => (
          <TextField {...params} size='small' label='Land to be monitored' />
        )}
      />
      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Skeleton variant='rectangular' width={'100%'} height={300} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {lands.map((land) => (
            <Grid item xs={12} md={4} key={land.id}>
              <Card sx={{ backgroundColor: land.flagged ? '#ffebee' : '#fff' }}>
                <CardMedia
                  component='img'
                  height='140'
                  image={land.photoUrl || 'https://via.placeholder.com/150'}
                  alt={land.name}
                />
                <CardContent>
                  <Typography gutterBottom variant='h6' component='div'>
                    {land.name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Ground-level ozone: {land.ozone}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Particle pollution: {land.particlePollution}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Carbon monoxide: {land.carbonMonoxide}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Sulfur dioxide: {land.sulfurDioxide}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Nitrogen dioxide: {land.nitrogenDioxide}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    AQI: {land.aqi}
                  </Typography>
                  <Button
                    variant='outlined'
                    sx={{ marginTop: '10px' }}
                    onClick={() => handleSeeHistory(land)}
                  >
                    See History
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
