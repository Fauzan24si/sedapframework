import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/spooky_moon_bg.png';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gray-900"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Semi-transparent dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* 404 Container */}
          <div className="flex justify-center items-center gap-2 md:gap-6 mb-2">
            <span className="text-white font-bold text-[10rem] md:text-[18rem] leading-none drop-shadow-2xl font-barlow">4</span>
            
            {/* Ghost SVG substituting '0' */}
            <div className="relative w-40 h-48 md:w-56 md:h-64 flex items-center justify-center animate-float mt-8">
               <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                 <defs>
                   <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="#ffffff" />
                     <stop offset="70%" stopColor="#f3f4f6" />
                     <stop offset="100%" stopColor="#d1d5db" />
                   </linearGradient>
                 </defs>
                 {/* Ghost Body */}
                 <path 
                   d="M 100 20 
                      C 30 20 20 80 20 140 
                      L 20 220 
                      C 35 210 50 230 65 215 
                      C 80 200 95 220 110 205 
                      C 125 190 140 220 155 205 
                      C 170 190 185 210 180 220 
                      L 180 140 
                      C 180 80 170 20 100 20 Z" 
                   fill="url(#ghostGrad)" 
                 />
                 {/* Eyes */}
                 <ellipse cx="75" cy="100" rx="14" ry="20" fill="#333" />
                 <ellipse cx="125" cy="100" rx="14" ry="20" fill="#333" />
               </svg>
            </div>

            <span className="text-white font-bold text-[10rem] md:text-[18rem] leading-none drop-shadow-2xl font-barlow">4</span>
          </div>

          {/* Text */}
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-2 tracking-wide drop-shadow-lg font-poppins">OOPS!</h1>
          <h2 className="text-white text-lg md:text-2xl font-medium tracking-widest uppercase mb-10 drop-shadow-lg font-poppins">Page Not Found</h2>

          {/* Buttons */}
          <div className="flex gap-4 md:gap-6">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-transparent border border-white/70 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white transition-all backdrop-blur-sm cursor-pointer text-sm md:text-base font-poppins"
            >
              Go Home
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-transparent border border-white/70 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white transition-all backdrop-blur-sm cursor-pointer text-sm md:text-base font-poppins"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
