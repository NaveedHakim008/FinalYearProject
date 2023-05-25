import React, { useState } from 'react';
import Button from '@mui/material/Button';

const UploadMultipleVideos = () => {
    const [files, setFiles] = useState('');
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    const [fileUploadResponse, setFileUploadResponse] = useState(null);
    const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8000";

    const uploadFileHandler = (event) => {
        setFiles(event.target.files);
        event.preventDefault();
    };

    const fileSubmitHandler = (event) => {
        event.preventDefault();
        setFileUploadProgress(true);
        setFileUploadResponse(null);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`files`, files[i])
        }
        const requestOptions = {
            method: 'POST',
            body: formData
        };
        fetch(FILE_UPLOAD_BASE_ENDPOINT+'/uploadVideos', requestOptions)
        .then(async response => {
            const data =  await response.json();
      

                // if (!response.ok) {
                //     const error = (data && data.message) || response.status;
                //     setFileUploadResponse(data.message);
                //     console.log('Something went wrong.');
                //     return Promise.reject(error);
                // }

            //    console.log(data.message);
            //    setFileUploadResponse(data.message);
            })
            .catch(error => {
                console.error('Error while uploading file.', error);
            });
        setFileUploadProgress(false);
      };

    return(

      <form>
        <input type="file"  multiple accept="video/*" onChange={uploadFileHandler}/>
        <br/>
        <br/>
        <Button variant="text" size="small" onClick={fileSubmitHandler} type="submit">Upload</Button>
        {fileUploadProgress && <p style={{color:'red'}}>Uploading File(s)</p>}
        {fileUploadResponse!=null && <p style={{color:'green'}}>{fileUploadResponse}</p>}
    

        
      </form>
    );
}
export default UploadMultipleVideos;