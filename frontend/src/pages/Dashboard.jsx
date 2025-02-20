import React, { useState } from "react";
import { Share2, Clock, Shield, FileUp } from "lucide-react";
import BackgroundBeamsWithCollision from "../ui/background-breams.jsx";
import { backend_url } from "../secrets.js";

const Dashboard = () => {
  const [url, setUrl] = useState("fetching");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUrl = async () => {
    setLoading(true);
    setShow(false);

    setTimeout(async () => {
      try {
        const response = await fetch(`${backend_url}api/session/start`, {
          method: "POST",
        });
        const data = await response.json();
        setUrl(data.url);
        setShow(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }, 2000);
  };

  return (
      <div className="relative min-h-screen bg-gray-900 text-gray-100">
        <BackgroundBeamsWithCollision>

          {/* Full Page Container */}
          <div className="flex flex-col min-h-screen justify-between">

            {/* Header */}
            <header className="py-12 p-2 mb-2">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold underline underline-offset-6 decoration-1">
                  <span className="text-red-500">Seedha </span>
                   Sauda
                </h1>
                <p className="text-md md:text-xl text-gray-400 mt-2 max-w-2xl mx-auto">
                  Share files and text seamlessly without logins or hassle
                </p>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
              <div className="container mx-auto mt-10 px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">

                  {/* Instructions Section */}
                  <div>
                    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                      <h2 className="text-xl md:text-3xl raleway font-bold mb-3 md:mb-6 flex items-center">
                        <Share2 className="mr-2" /> How It Works
                      </h2>
                      <div className="space-y-2 md:space-y-3 text-gray-300 raleway font-semibold text-sm md:text-lg">
                        <div className="flex items-center space-x-4">
                          <Clock className="h-5 w-5 md:w-6 md:h-6  text-red-400" />
                          <p>Each session lasts 10 minutes.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <FileUp className="h-5 w-5 md:w-6 md:h-6  text-red-400" />
                          <p>File uploads are limited to 10 MB.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Shield className="h-5 w-5 md:w-6 md:h-6 text-red-400" />
                          <p>Secure and private transfers.</p>
                        </div>
                      </div>
                      <button
                          onClick={fetchUrl}
                          disabled={loading}
                          className="mt-6 w-full py-3 px-6 bg-red-500 hover:bg-gray-100 hover:cursor-pointer hover:text-black duration-200 text-white font-semibold rounded-lg transition  disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Generating Session..." : "Generate New Session"}
                      </button>
                      {loading && (
                          <div className="flex justify-center mt-6 space-x-2">
                            <div
                                className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0s" }}
                            />
                            <div
                                className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                            />
                            <div
                                className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Session Link Section */}
                  <div>
                    {show && (
                        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                          <h2 className="text-xl md:text-2xl md:mb-4 font-bold raleway mb-2">
                            Your Session is Ready!
                          </h2>
                          <p className="text-gray-300 font-medium raleway text-sm md:text-md mb-4">
                            Click below to start your secure sharing session. The
                            link expires in 10 minutes.
                          </p>
                          <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full py-3 px-6 hover:bg-gray-100 hover:text-black bg-green-600  duration-200text-white text-center font-semibold rounded-lg transition duration-200"
                          >
                            Open Secure Session
                          </a>
                        </div>
                    )}
                    {!show && (
                        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 text-center">
                          <h2 className="text-2xl font-semibold mb-4">
                            No Session Active
                          </h2>
                          <p className="text-gray-400">
                            Start a session by clicking "Generate New Session."
                          </p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="py-2 md-py-6 bg-gray-800">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-md md:text-lg font-semibold">
                  Safe, Secure, Reliable
                </h2>
                <p className="text-gray-400 text-sm md:text-xl ">
                  Seedha Sauda makes sharing simple. No logins.
                  files.
                </p>
                <p className="text-xs md:text-md text-gray-500 mt-2">
                  Built with ❤️ for seamless sharing.
                </p>
              </div>
            </footer>

          </div>
        </BackgroundBeamsWithCollision>
      </div>
  );
};

export default Dashboard;