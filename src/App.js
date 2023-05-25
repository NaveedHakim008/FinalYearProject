import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes,Redirect } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UploadForm from './pages/Uploadform';
import PictureForm from './pages/pictureForm';
import Logs from './pages/logs';
import ResponseTable from './pages/VideoResponse';
import VideoPlayer from './pages/VideoResponse';

const App = () => {
  return (
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/uploadform" element={<UploadForm />} />
        <Route path="/pictureform" element={<PictureForm />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
 // <ResponseTable/>
  //   <VideoPlayer
  //   id="demo-player"
  //   publicId="zhhws2qu3blfwcxmupb4"
  //   width="3840"
  //   height="100"
  // />
export default App;
