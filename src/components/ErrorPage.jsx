import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/spooky_moon_bg.png';

const errorConfig = {
    400: {
        title: "Bad Request",
        subtitle: "Permintaan Tidak Valid",
    },
    401: {
        title: "Unauthorized",
        subtitle: "Akses Tidak Diizinkan",
    },
    403: {
        title: "Forbidden",
        subtitle: "Akses Ditolak",
    },
    404: {
        title: "Not Found",
        subtitle: "Page Not Found",
    },
};

export default function ErrorPage({ errorCode = 404, description }) {
    const navigate = useNavigate();
    const config = errorConfig[errorCode] || errorConfig[404];

    // Asumsikan semua kode error formatnya 40X
    const codeString = String(errorCode);
    const firstDigit = codeString[0] || "4";
    const lastDigit = codeString[2] || "0";

    return (
        <div 
            className="w-full flex flex-col items-center justify-center relative overflow-hidden bg-gray-900 rounded-[28px] py-20 px-4 min-h-[calc(100vh-140px)] shadow-xl"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <style>
                {`
                  @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-16px); }
                    100% { transform: translateY(0px); }
                  }
                  .animate-float {
                    animation: float 4s ease-in-out infinite;
                  }
                `}
            </style>

            {/* Overlays untuk menutupi background agar text jelas */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none rounded-[28px]"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Container Angka Error */}
                <div className="flex justify-center items-center gap-1 md:gap-4 mb-2">
                    <span className="text-white font-bold text-[8rem] sm:text-[10rem] md:text-[14rem] leading-none drop-shadow-2xl font-barlow">
                        {firstDigit}
                    </span>
                    
                    {/* Ghost SVG menggantikan angka '0' di tengah */}
                    <div className="relative w-28 h-36 sm:w-36 sm:h-44 md:w-52 md:h-60 flex items-center justify-center animate-float mt-6 md:mt-10">
                       <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]">
                         <defs>
                           <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="#ffffff" />
                             <stop offset="70%" stopColor="#f3f4f6" />
                             <stop offset="100%" stopColor="#d1d5db" />
                           </linearGradient>
                         </defs>
                         {/* Body */}
                         <path 
                           d="M 100 20 C 30 20 20 80 20 140 L 20 220 C 35 210 50 230 65 215 C 80 200 95 220 110 205 C 125 190 140 220 155 205 C 170 190 185 210 180 220 L 180 140 C 180 80 170 20 100 20 Z" 
                           fill="url(#ghostGrad)" 
                         />
                         {/* Eyes */}
                         <ellipse cx="75" cy="100" rx="14" ry="20" fill="#222" />
                         <ellipse cx="125" cy="100" rx="14" ry="20" fill="#222" />
                       </svg>
                    </div>

                    <span className="text-white font-bold text-[8rem] sm:text-[10rem] md:text-[14rem] leading-none drop-shadow-2xl font-barlow">
                        {lastDigit}
                    </span>
                </div>

                {/* Subtitle / Text */}
                <h1 className="text-white text-3xl md:text-5xl font-bold mb-3 tracking-wide drop-shadow-lg font-poppins text-center">
                    OOPS!
                </h1>
                <h2 className="text-white/90 text-base md:text-xl font-semibold tracking-[0.2em] uppercase mb-12 drop-shadow-md font-poppins text-center">
                    {config.subtitle}
                </h2>

                {/* Action Buttons */}
                <div className="flex gap-4 sm:gap-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2.5 sm:px-8 sm:py-3 bg-black/30 border border-white/60 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white transition-all duration-300 backdrop-blur-md cursor-pointer text-sm sm:text-base font-poppins shadow-lg"
                    >
                        Go Home
                    </button>
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 sm:px-8 sm:py-3 bg-black/30 border border-white/60 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white transition-all duration-300 backdrop-blur-md cursor-pointer text-sm sm:text-base font-poppins shadow-lg"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
