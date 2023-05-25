import { useEffect, useRef } from 'react';

const VideoPlayer = ({publicId, cloudname}) => {
  const videoRef = useRef();
  const cloudinaryRef = useRef();
  const playerRef = useRef();

  // Store the Cloudinary window instance to a ref when the page renders

  useEffect(() => {
    if ( cloudinaryRef.current ) return;
    console.log("cloud",cloudname);
    console.log("cloud",publicId);

    cloudinaryRef.current = window.cloudinary;

    playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "dywjaddlk" ,
      secure: true
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', aspectRatio: 3000/1000}}>
      <video
        ref={videoRef}
        // id={id}
        className="cld-video-player cld-fluid"
        controls
        autoPlay
        data-cld-public-id={publicId}
        
      />
    </div>
  )
}

export default VideoPlayer;