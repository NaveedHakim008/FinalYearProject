import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import { AddCircle } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Alert from '@mui/material/Alert';
import Sidebar from "../components/Sidebar";

const theme = createTheme();

const Pictureform = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [files, setFiles] = useState({});
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("4");
  const [fileUploadProgress, setFileUploadProgress] = useState(false);
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);

  const values = ["1", "2", "3", "4"];

  const handleDropDownChange = (event) => {
    setSelected(event.target.value);
  };

  const fileChangeHandler =  (event) => {

    const fileName = event.target.files[0].name;
    

    const nameWithExtension = name + ".png";
    const fieldName = event.target.name;
    const newName = name + fieldName + ".png";
  

    const newFile = new File([event.target.files[0]], newName);

    setFiles({ ...files, [fieldName]: newFile });
  
    console.log("FieldName",fieldName)
    console.log("newName",newName)
    // const fileDisplay = document.getElementById(fieldName + "-file-display");
    // fileDisplay.innerHTML = newName;
  };

  const fileSubmitHandler = async (event) => {
    event.preventDefault();

    if (!files.left || !files.right || !files.top || !files.bottom) {
      alert("Please upload images in all four fields.");
      return;
    }
  
    setFileUploadProgress(true);
    setFileUploadResponse(null);
  
    const formData = new FormData();
  
    formData.append("left", files.left, `${name}left.png`);
    formData.append("right", files.right, `${name}right.png`);
    formData.append("top", files.top, `${name}top.png`);
    formData.append("bottom", files.bottom, `${name}bottom.png`);
  
    
  
    const fileNames = {};
    
    fileNames.left =  "left.png";
    fileNames.right =  "right.png";
    fileNames.top = name + "top.png";
    fileNames.bottom = name + "bottom.png";
  
    setFiles(fileNames);

    const requestOptions = {
      method: "POST",
      body: formData,
    };
    setIsLoading(true);
    const response = await fetch("http://localhost:8000/uploadknownperson", requestOptions)
    const result=await response.json()

    try{
      if (result.upload == true) 
            setShowAlert(true);
          else 
          setShowAlert(false);
          setResponseStatus(response.status);
          setIsLoading(false);
        }
    catch(e){
      console.log(e);
        setIsLoading(false);
      }
    
    finally{
      setIsLoading(false)
    }
  }
    //   .then((response) => {
    //    return response.json();})
    //   .then(result => {
    //       if (result.upload == true) 
    //         setShowAlert(true);
    //       else 
    //         setShowAlert(false);
          
    //       setResponseStatus(response.status);
    //       setIsLoading(false);
    //     })
    //   .catch((error) => {
    //     console.log(error);
    //     setIsLoading(false);
    //   })
    //   .finally(() => setIsLoading(false));
    // }


    
    
    // .catch(err => Alert.alert('Error', err))
    // .finally(() => setLoading(false)
      
    //   const result = data;
    //   console.log("The response id",response.data)
    // if (result.status==200) {
    //   setShowAlert(true);
    // } else {
    //   setShowAlert(false);
    // }
    //   setResponseStatus(response.status);
    //   setIsLoading(false);
    // })
    


  return (
    // <> 
    <Sidebar>
    <ThemeProvider theme={theme}>
      
      <CssBaseline />
      {showAlert && (
          <Alert severity="info">
            <p>This person has been added in our known person list.</p>
          </Alert>
      )}
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AddCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            UPLOAD KNOWN PERSON IMAGES
          </Typography>
          <Box component="form" onSubmit={fileSubmitHandler} sx={{ mt: 3 }}>
            
            <Box sx={{ mt: 4 }}>
              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Upload a picture for left angle:
                </Typography>
                <input type="file" accept="image/png, image/jpeg" name="left" onChange={fileChangeHandler} />
                {files.left && (
                  <Typography variant="subtitle1" gutterBottom>
                    File name: {`${name}left.png`}
                  </Typography>
                )}
              </div>
            </Box>
            <Box sx={{ mt: 4 }}>
              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Upload a picture for right angle:
                </Typography>
                <input type="file" accept="image/png, image/jpeg"  name="right" onChange={fileChangeHandler} />
                {files.right && (
                  <Typography variant="subtitle1" gutterBottom>
                    File name: {`${name}right.png`}
                  </Typography>
                )}
              </div>
            </Box>
            <Box sx={{ mt: 4 }}>
              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Upload a picture for top angle:
                </Typography>
                <input type="file" accept="image/png, image/jpeg"  name="top" onChange={fileChangeHandler} />
                {files.top && (
                  <Typography variant="subtitle1" gutterBottom>
                    File name: {`${name}top.png`}
                  </Typography>
                )}
              </div>
            </Box>
            <Box sx={{ mt: 4 }}>
              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Upload a picture for bottom angle:
                </Typography>
                <input type="file" accept="image/png, image/jpeg"  name="bottom" onChange={fileChangeHandler} />
                {files.bottom && (
                  <Typography variant="subtitle1" gutterBottom>
                    File name: {`${name}bottom.png`}
                  </Typography>
                )}
              </div>
            </Box>
            {isLoading ? (
              <div className='loader'></div>
            ) : (
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, mb: 2 }}>
                    Upload
                  </Button>
            )}
          </Box>
          {fileUploadProgress && <div>File is uploading...</div>}
          {/* {fileUploadResponse && <div>{fileUploadResponse}</div>} */}
        </Box>
      </Container>
    </ThemeProvider>
    </Sidebar> 
  )
  
            }
  
  
  
  
            
export default Pictureform;