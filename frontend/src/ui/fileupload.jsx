import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import "../index.css";
import "./file.css";

const socket = io('http://localhost:5000'); // ✅ Move socket outside component

const Fileupload = () => {
    const [chosenFiles, setChosenFiles] = useState([]);
    const [sessionFiles, setSessionFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // ✅ Listen for incoming files only once
    useEffect(() => {
        const savedFiles = sessionStorage.getItem("sessionFiles");
        if (savedFiles) {
            setSessionFiles(JSON.parse(savedFiles));
        }
        const handleReceiveFiles = (files) => {
            console.log("🟠 Received Files from Socket:", files);
            setSessionFiles((prevFiles) => {
                const existingFiles = new Set(prevFiles.map(file => file.url)); // Prevent duplicates
                const newFiles = files.filter(file => !existingFiles.has(file.url));
                return [...prevFiles, ...newFiles];
            });
        };

        socket.on("receiveFiles", handleReceiveFiles);

        return () => {
            socket.off("receiveFiles", handleReceiveFiles); // ✅ Cleanup on unmount
        };
    }, []);
    useEffect(() => {
        sessionStorage.setItem("sessionFiles", JSON.stringify(sessionFiles));
    }, [sessionFiles]);


    // ✅ Upload files to Cloudinary
    const fileUpload = async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.files;
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    };

    // ✅ Handle file selection
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.filter((file) =>
            !chosenFiles.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size)
        );
        if (newFiles.length > 0) {
            setChosenFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    // ✅ Remove file from chosen list
    const handleRemoveFile = (index) => {
        setChosenFiles(chosenFiles.filter((_, i) => i !== index));
    };

    // ✅ Upload files and emit via socket
    const handleSubmit = async () => {
        if (chosenFiles.length === 0) return;
        setLoading(true);

        console.log("🟣 Submitting files:", chosenFiles);

        try {
            const uploadedFiles = await fileUpload(chosenFiles);
            console.log("🔵 Received uploaded files:", uploadedFiles);

            // ✅ Only emit, DO NOT update sessionFiles on sender side
            socket.emit('sendFile', uploadedFiles);

            setChosenFiles([]);
            setLoading(false);
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    // ✅ Format file size
    const formatFileSize = (size) => {
        const units = ['bytes', 'KB', 'MB', 'GB'];
        let i = 0;
        while (size >= 1024 && i < units.length - 1) {
            size /= 1024;
            i++;
        }
        return `${size.toFixed(2)} ${units[i]}`;
    };

    // ✅ Download file
    const downloadFile = async (url, fileName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <>
            <h1 className="text-center text-2xl raleway m-2 text-gray-200 font-bold">Upload File</h1>
            <div className="p-2 flex flex-col md:flex-row items-center gap-y-4 gap-x-4 h-min-screen md:h-auto">
                {/* File selection form */}
                <div className=''>
                    <form className='flex  flex-col items-center gap-y-2' onSubmit={(e) => e.preventDefault()}>
                        <input
                            className='text-gray-300  bg-slate-900 cursor-pointer hover:bg-slate-950 duration-200 p-10 pl-22 text-center rounded-2xl w-full  md:h-72 md:w-96'
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            multiple
                        />
                        <button
                            className='h-10 font-bold text-md px-6 py-2 cursor-pointer hover:bg-teal-900 hover:text-gray-200 border-2 border-gray-200 duration-200 josefin bg-gray-200 rounded-2xl'
                            type="button"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </form>
                </div>

                {/* Chosen Files Section */}
                <div className='bg-neutral-800 border-gray-500 border-2 hello rounded-xl w-full max-h-screen  h-auto min-h-60 md:h-96 md:w-96 p-2 pt-3 overflow-y-auto text-center'>
                    <h1 className='mb-3 text-gray-200 text-xl underline underline-offset-2 decoration-1 font-semibold josefin'>Chosen Files:</h1>
                    {loading ? (<h1 className='text-white font-bold text-center text-xl'>Loading...</h1>
                    ) : (<div>
                        {chosenFiles.map((file, index) => (
                            <div className="bg-neutral-950 p-3 rounded-lg" key={index} style={{ marginBottom: '10px' }}>
                                <div className="text-gray-400 flex justify-between josefin text-md">
                                    <h3 className='text-gray-200 truncate' style={{ width: '15ch' }}>{file.name}</h3>
                                    <h3>{formatFileSize(file.size)}</h3>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    at: {new Date().toLocaleString()}
                                    <button
                                        className="bg-slate-900 text-red-700 text-sm px-2 py-0.5 rounded-lg cursor-pointer font-semibold"
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        Remove

                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>)}
                </div>

                {/* Session Files haha got it Section */}
                <div className='w-full  h-auto min-h-60 md:h-96 md:w-96  hello p-2 bg-gray-200 max-h-screen rounded-lg overflow-y-auto'>
                    <h1 className="text-xl font-semibold mb-3 text-center">Session Files:</h1>
                    <div>
                        {sessionFiles.map((file, index) => (
                            <div className="bg-neutral-950 p-4 rounded-lg flex justify-center gap-x-2 items-center"
                                 key={index} style={{ marginBottom: '10px' }}>
                                <div className="text-gray-400 flex gap-x-2 justify-between josefin text-md ">
                                    <h3 className='text-gray-200 truncate' style={{ width: '15ch' }}>{file.name}</h3>
                                    <h3>{formatFileSize(file.size)}</h3>
                                    <button
                                        className="bg-teal-700 cursor-pointer text-white text-sm px-2 py-1 rounded-lg"
                                        onClick={() => downloadFile(file.url, file.name)}
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Fileupload;
