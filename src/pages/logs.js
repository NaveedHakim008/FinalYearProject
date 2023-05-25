import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Grid,
  Box,
  Typography,
  Container,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Avatar,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VideoPlayer from './VideoResponse';

const theme = createTheme();

export default function Logs() {
  const [cloudName, setCloudName] = useState('dywjaddlk');
  const [publicId, setPublicId] = useState('');
  const [publicIdbool, setPublicIdBool] = useState(false);
  const [cloudnamedbool, setcloudnamedBool] = useState(false);
  const [previousLogClicked, setPreviousLogClicked] = useState([
    {
      objectID: '',
      personID: 0,
      imageURL: '',
      date: '',
      camNo: [],
      auth: false,
      publicId: '',
    }

  ]);
  const [selectedDate, setSelectedDate] = useState('');
  const [tableData, setTableData] = useState([{
    objectID: '',
    personID: 0,
    imageURL: '',
    date: '',
    camNo: [],
    auth: false,
    publicId: '',
  }]);

  const handleDateChange = (event) => {
    const date = event.target.value;
    sessionStorage.setItem('selectedDate', date);
    setSelectedDate(date);
    setTableData(previousLogClicked);
    const logClicked = tableData.find((log) => log.date === date);
    if (logClicked) {
      setCloudName(logClicked.cloud_name);
      setPublicId(logClicked.publicId);
      setPublicIdBool(true);
      setcloudnamedBool(true);
    } else {
      setCloudName('dywjaddlk');
      setPublicId('');
      // setPublicIdBool(true);
      setcloudnamedBool(true)
    }

    handleDateSubmit(date);
  };

  const tableSet = async () => {
    const result = await fetch('http://localhost:8000/getlogs')
    const res = await result.json();
    setTableData(res);
    setPreviousLogClicked(res);
    console.log(res);
    console.log(tableData);
  }
  useEffect(() => {
    tableSet();
  }, []);
  const handleDateSubmit = (date) => {
    // newdata=FormData()
    // newdata.append('date',date)

    const filteredLogs = tableData.filter((log) => log.date === date);
    setPreviousLogClicked(filteredLogs);
  };

  return (
    <Sidebar>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ mb: 2 }}>L</Avatar>
            <Typography component="h1" variant="h5">
              LOGS
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    required
                    fullWidth
                    id="select-date"
                    label="Select a date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  >
                    <MenuItem value="">Select a date</MenuItem>
                    {tableData?.map((prevLogs) => (
                      <MenuItem key={prevLogs.objectID} value={prevLogs.date}>
                        {prevLogs.date}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Table sx={{ border: '1px solid #ccc', mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Picture</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Status</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previousLogClicked.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ border: '1px solid #ccc' }}>
                        Select date
                      </TableCell>
                    </TableRow>
                  ) : (
                    previousLogClicked?.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ border: '1px solid #ccc' }}>
                          <img src={value.imageURL} />
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>
                          {value.auth ? 'UnKnown Person' : 'KnownPerson'}
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #ccc' }}>
                          {value.camNo.map((countValue, i) => (
                            <p>{countValue}</p>
                          ))}
                        </TableCell>
                        {value.date && <Box sx={{ mt: 3 }}>
                        </Box>}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
            {<VideoPlayer publicId={"2023-05-15"} cloudname={cloudName} />}

          </Box>


        </Container>
      </ThemeProvider>
    </Sidebar>
  );
}
