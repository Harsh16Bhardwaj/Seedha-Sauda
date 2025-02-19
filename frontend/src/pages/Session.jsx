import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import BackgroundBeamsWithCollision from "../ui/background-breams";
import "../index.css";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import FileUpload from "../ui/fileupload";
import QRCode from "qrcode";

function Session() {
  const { sessionId } = useParams(); // Get session ID from the route parameters
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("");
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef(null);
  const [link, setLink] = useState("");
  const [qrCodeDataURL, setQrCodeDataURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [remainingTime, setRemainingTime] = useState(600);
  const [timerDisplay, setTimerDisplay] = useState("10:00");
  const [statusbg, setStatusbg] = useState("#c71b08");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(
            `http://localhost:5000/api/session/time/${sessionId}`
        );
        const sessionCreationTime = new Date(response.data.createdAt).getTime();
        const currentTime = Date.now();
        const elapsedTime = Math.floor(
            (currentTime - sessionCreationTime) / 1000
        );
        const calculatedRemainingTime = Math.max(600 - elapsedTime, 0);
        setRemainingTime(calculatedRemainingTime);
      } catch (error) {
        console.error("Error fetching session creation time:", error);
        setRemainingTime(0);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    const url = "https://seedhe-sauda.vercel.app/session/" + sessionId;
    setLink(url);

    QRCode.toDataURL(url)
        .then((url) => setQrCodeDataURL(url))
        .catch((error) => console.error("Error generating QR code:", error));

    const newSocket = io("https://seedhe-sauda.vercel.app/");
    setSocket(newSocket);

    newSocket.emit("joinSession", sessionId);

    newSocket.on("sessionJoined", (data) => {
      setStatus(data.message);
      setStatusbg("#08c761");
    });

    newSocket.on("sessionError", (error) => setStatus(error.message));

    // Listen for files shared by other users in the session
    newSocket.on("receiveFiles", (files) => {
      console.log("Received Files from Socket:", files); // Debug file data received from the socket

      setFileList((prevFiles) => [
        ...prevFiles,
        ...files.map((file) => ({
          name: file.id, // Use unique Cloudinary public_id
          link: file.url, // Use secure_url for Cloudinary link
        })),
      ]);
    });


    return () => newSocket.disconnect();

  }, [sessionId]);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const updateTimerDisplay = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setTimerDisplay(
          `${String(minutes).padStart(2, "0")}:${String(
              remainingSeconds
          ).padStart(2, "0")}`
      );
    };

    updateTimerDisplay(remainingTime);

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        updateTimerDisplay(prevTime - 1);
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  // const handleFileSelection = () => {
  //   if (fileInputRef.current?.files.length) {
  //     setSelectedFile(fileInputRef.current.files[0]);
  //   }
  // };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setStatus("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;
      socket.emit("sendFile", {
        sessionId,
        fileData,
        fileName: selectedFile.name,
      });
      setFileList((prevFiles) => [
        ...prevFiles,
        { name: selectedFile.name, data: fileData },
      ]);
      setStatus("File sent successfully!");
      setSelectedFile(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
      <div>
        <BackgroundBeamsWithCollision>
          <div className="w-full flex md:flex-col items-center justify-center gap-y-6 px-4 py-2">
            {/* Timer and QR Code Block */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Timer */}
              <div className="text-red-500 bg-gray-800 rounded-lg text-5xl md:text-7xl w-auto  text-center font-medium titan-one">
                {timerDisplay}
              </div>

              {/* QR Code - Displays in Row for Larger Screens */}
              {qrCodeDataURL && (
                  <div className="flex items-center gap-4">
                    <img
                        src={qrCodeDataURL}
                        alt="QR Code"
                        className="w-40 h-40 rounded-lg"
                    />
                    <div className="text-white hidden md:flex md:flex-col text-lg text-center">
                      <p>Scan the QR</p>
                      <p>To Join the Session</p>
                    </div>
                  </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 px-4 md:px-16">
            <div className="bg-slate-800  rounded-2xl p-2 md:p-6">
              {/* Status Message */}
              <div className="flex justify-center space-x-2 items-center mb-4 md:mb-0">
                <div style={{ backgroundColor: statusbg }} className="w-5 h-5 rounded-full bg-blue-950"></div>
                <p

                    className="text-black raleway md:text-md text-xs font-bold md:w-80 bg-gray-300 w-60 rounded-lg px-4 py-1 text-center"
                >
                  {status}
                </p>
              </div>
              {/* File Upload Section */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-x-4">
                  <FileUpload sessionId={sessionId}  />

                </div>
              </div>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </div>
  );
}

export default Session;