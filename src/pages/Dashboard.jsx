import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const AboutUs = () => {
  return (
    <Box>
      <AppBar position="static" sx={{ width: '100%' }}>
        <Toolbar sx={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Navigation Bar
          </Typography> */}
          <Button color="inherit" component={Link} to="/signup">
            Sign Up
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={styles.container}>
        <Typography variant="h1" sx={styles.heading}>Person Re-Identification Based Surveillance Platform</Typography>
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h3" sx={styles.subHeading}>Introduction</Typography>
          <Typography variant="body1" sx={styles.paragraph}>
            The Person Re-identification based Surveillance System is an advanced technology that uses deep learning, computer vision, and web application development to re-identify unknown persons who access or enter places/resources where they are not permitted across a network of cameras. The technology has numerous applications, including the identification of criminals from police databases and tracking people in sensitive spaces such as country borders, police stations, and high-risk monitored jurisdictions.
          </Typography>
        </Paper>
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h3" sx={styles.subHeading}>Problem Statement</Typography>
          <Typography variant="body1" sx={styles.paragraph}>
            One of the major concerns for any organization is the security of their premises and assets. Unauthorized access by unknown persons can lead to theft, loss of confidential information, or even harm to individuals. Traditional surveillance systems often fail to identify unknown persons, leading to security breaches. There is a need for a system that can detect unknown persons and re-identify them in case of any unauthorized access.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  
  },
  heading: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '40px',
    color: '#333',
    textTransform: 'uppercase',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '60px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  subHeading: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#666',
    textTransform: 'uppercase',
    fontFamily: 'Arial, sans-serif',
  },
  paragraph: {
    fontSize:'18px',
    lineHeight: '1.6',
    color: '#555',
    fontFamily: 'Arial, sans-serif',
    },
    };
    
export default AboutUs;