import React from "react";
import { Link } from "react-router-dom";
import { BackgroundLines } from "../ui/background-lines";
import { Highlight } from "../ui/hero-highlight.jsx";
import "../index.css";
import Button from "../ui/button.jsx";
import Panda from "../../public/Panda.png"

function Landing() {
  return (
      <>
        <BackgroundLines>
          <div className="text-white min-h-screen w-full text-center px-6 sm:px-10 lg:px-40 py-20">
            {/* Header */}
            <img src={Panda} alt="Panda" className="w-40  rounded-full mx-auto" />
            <h1 className="font-bold mt-5 text-4xl sm:text-6xl lg:text-8xl montserrat">
              Seedha <span className="text-red-500">Sauda</span>
            </h1>

            {/* Separator */}
            <div className="w-full h-auto flex justify-center items-center mb-2 sm:mb-4 m-2 ">
              <hr className="h-0.5 bg-gray-400 w-3/4 sm:w-1/2  " />
            </div>

            {/* Highlight Section */}
            <Highlight>
              <h3 className="raleway font-semibold my-1 mx-4 sm:mx-8 text-md sm:text-xl lg:text-2xl">
                No Login, No Nonsense, Just Transfer
              </h3>
            </Highlight>

            {/* Description */}
            <div className="px-4 sm:px-20 md:px-40 lg:px-60 mt-4">
              <p className="text-sm sm:text-base lg:text-lg leading-5 sm:leading-6 text-slate-300 mt-2">
                Seedha Sauda lets you share files and text instantly without
                logins or app installations. Just create a session, share the
                unique link, and transfer seamlessly between devices. Upload
                files, share text, and download content instantly. Enjoy
                hassle-free sharing.
              </p>
            </div>

            {/* Button Section */}
            <div className="mt-2 sm:mt-4">
              <Link to="/dashboard">
                <Button />
              </Link>
            </div>
          </div>
        </BackgroundLines>
      </>
  );
}

export default Landing;