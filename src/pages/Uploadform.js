import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import { AddCircle } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Sidebar from '../components/Sidebar';
const theme = createTheme();
const formData = new FormData();

const Uploadform = ({ onSubmit }) => {
  const [files, setFiles] = useState('');
  const [fileUploadProgress, setFileUploadProgress] = useState(false);
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const [values, setValues] = useState(['2', '3']);
  const [selected, setSelected] = useState('2');
  const [dateVideo, setDateVideo] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [IsSubmit, setIsSubmit] = useState(false);
  const [IsUpload, setIsUpload] = useState(false);
  const [processed,setProcessed]=useState(true);
  const fileChangeHandler = (e) => {
    setFiles(e.target.files);
    // console.log(e.target.files);
    e.preventDefault();
  };
  useEffect(()=>{
    setIsSubmit(false);
  },[IsUpload])

  const handleDropDownChange = (event) => {
    setDateError(false);
    setSelected(event.target.value);
  };

  const fileSubmitHandler = (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const selectedDate = new Date(dateVideo);
    if (selectedDate > currentDate) {
      setDateError(true);
      return;
    }
    console.log('Files.length', files.length);
    console.log(selected);
    if (files.length !== parseInt(selected)) {
      setFileError(true);
      return;
    }
    setFileUploadProgress(true);
    setFileUploadResponse(null);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('date', dateVideo);
    console.log(dateVideo);
    sessionStorage.setItem('selectedDate', dateVideo);
    console.log(typeof dateVideo);
    setIsUpload(true);
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!IsUpload) {
      setIsSubmit(true);
      return;
    }
    if (IsUpload === true) {
      const currentDate = new Date();
    const selectedDate = new Date(dateVideo);
    if (selectedDate > currentDate) {
      setDateError(true);
      return;
    }
    console.log('Files.length', files.length);
    console.log(selected);
    if (files.length !== parseInt(selected)) {
      setFileError(true);
      return;
    }
      setIsSubmit(true);
      formData.forEach((value, key) => {
        console.log(`key ${key}: value ${value}`);
      });

      const requestOptions = {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      };
      const response=await fetch('http://localhost:8000/upload_videos', requestOptions)
      try{
        const result= await response.json()
        setIsSubmit(false)
      setProcessed(true)
   }
      catch(e)
      {
        setProcessed(true)
        setIsSubmit(false)
        
      }
     
      setShowConfirmationDialog(true)
      onSubmit(dateVideo);
    }
  };

  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
  };

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  return (
    <Sidebar>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />


        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 0.5, bgcolor: 'primary.main' }}>
            <AddCircle />
          </Avatar>
          <Typography color="secondary" component="h1" variant="h5">
            Process Videos
          </Typography>
          <br />
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              id="date"
              label="Date"
              type="date"
              name="videoDate"
              value={dateVideo}
              onChange={(e) => {
                setDateVideo(e.target.value);
                setDateError(false); // Remove the error when the user enters a new date
              }}
              defaultValue={date}
              sx={{ width: 450 }}
              InputLabelProps={{
                shrink: true,
              }}
            // error={dateError}
            // helperText={dateError && 'Invalid date'}
            />
            {dateError && (
              <Alert severity="error">
                <p>Input correct date</p>
              </Alert>
            )}
            <FormControl>
              <InputLabel htmlFor="agent-simple" sx={{ mt: 3, mb: 2 }}></InputLabel>
              <Select
                value={selected}
                // onChange={handleDropDownChange}
                onChange={(e) => {
                  handleDropDownChange(e);
                  setFileError(false);
                }}
                sx={{ mt: 3, mb: 2, width: 450 }}
                inputProps={{
                  name: 'Videos',
                  id: 'Videos',
                }}
                error={fileError}
                helperText={fileError && 'Upload the correct number of videos.'}
              >
                {values.map((value, index) => {
                  return <MenuItem value={value}>{value}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <form>
              <input
                type="file"
                multiple
                accept="video/*"
                //  onChange={fileChangeHandler}
                onChange={(e) => {
                  fileChangeHandler(e);
                  setFileError(false);
                }}
                error={fileError}
                helperText={fileError && 'Upload the correct number of videos.'}
              />
              {fileError && (
                <Alert severity="error">
                  <p>Upload correct number of videos as per the dropdown input.</p>
                </Alert>
              )}

              <br />
              <br />
              <Button variant="text" size="small" onClick={fileSubmitHandler} type="submit">
                Upload
              </Button>
              {fileUploadProgress && <p style={{ color: 'red' }}>Uploading File(s)</p>}
              {fileUploadResponse !== null && <p style={{ color: 'green' }}>{fileUploadResponse}</p>}
            </form>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, width: 450 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            {IsSubmit &&  (
                <Alert severity="info">
                  <p>The video is under processing.</p>
                </Alert>
              )}
            {IsSubmit && !IsUpload && (
                <Alert severity="error">
                  <p>Click on Upload or check if correct input has been given,before clicking on Submit.</p>
                </Alert>
              )}
          </Box>
        </Box>
      </Container>
      {processed &&
      <Dialog open={showConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            Check the 'Logs' 
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>OK</Button>
        </DialogActions>
      </Dialog>
}
    </ThemeProvider>
    </Sidebar>
  );
};
Uploadform.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Uploadform;
