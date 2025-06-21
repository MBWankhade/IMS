export const languages = [
    {
        name:"c",
        version: "10.2.0"
    },
    {
        name:"cpp",
        version: "10.2.0"
    },
    {
        name:"java",
        version: "15.0.2"
    },
    {
        name:"python",
        version: "3.10.0"
    },
    {
        name:"javascript",
        version: "1.32.3"
    },
    {
        name:"typescript",
        version: "5.0.3"
    }
]





// Dont delete this code

{/* Profile Card (Left) */}
        {/* <div
          className="w-1/5 m-5 p-5 bg-white border border-blue-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ height: "250px", overflowY: "auto" }}
        >
          <div className="flex flex-col items-center">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-full cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
              />
            ) : (
              <FaUserCircle
                size={80}
                className="mb-4 cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-300"
              />
            )}
            <h2 className="text-xl font-bold text-gray-800 mt-2">
              {user?.name}
            </h2>
            <h2 className="text-sm text-gray-600 mt-1">{user?.email}</h2>
            <button className="mt-4 p-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
              View Profile
            </button>
          </div>
        </div> */}


        // const toggleCamera = async () => {
  //   const mediaStream = currentUserVideoRef.current.srcObject;
  //   if (!mediaStream) {
  //     console, log("no mediastream");
  //   }

  //   if (!isCameraOff) {
  //     console.log("turning off camera");
  //     // Turn off camera: stop all video tracks
  //     mediaStream.getVideoTracks().forEach((track) => {
  //       track.stop();
  //     });
  //     // Create a new stream containing only audio tracks (if any)
  //     // const audioTracks = mediaStream.getAudioTracks();
  //     // const newStream = new MediaStream(audioTracks);
  //     // currentUserVideoRef.current.srcObject = newStream;
  //     // // remoteVideoRef.current.srcObject = null;
  //     // // Optionally, update your local stream state if you have one
  //     // // // setLocalStream(newStream);
  //     setIsCameraOff(true);
  //   } else {
  //     console.log("turning on camera");
  //     // Turn camera on: re-request video from media devices
  //     try {
  //       const videoStream = await navigator.mediaDevices.getUserMedia({
  //         video: true,
  //       });
  //       // Combine existing audio tracks with the new video tracks
  //       const audioTracks = mediaStream.getAudioTracks();
  //       const combinedStream = new MediaStream([
  //         ...audioTracks,
  //         ...videoStream.getVideoTracks(),
  //       ]);
  //       currentUserVideoRef.current.srcObject = combinedStream;
  //       // remoteVideoRef.current.srcObject = combinedStream;
  //       // Optionally, update your local stream state if you have one
  //       // setLocalStream(combinedStream);
  //       setIsCameraOff(false);
  //     } catch (error) {
  //       console.error("Error re-enabling camera:", error);
  //       // Handle permission denial or errors as needed.
  //     }
  //   }
  // };