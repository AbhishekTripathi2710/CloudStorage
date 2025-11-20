import React from "react";
import { useFiles } from "../context/FileContext";

function niceBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B","KB","MB","GB","TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function StorageCard(){
  const { storage } = useFiles();

  const allocated = Number(storage.allocated) || 0;
  const used = Number(storage.used) || 0;
  const percent = allocated > 0 ? Math.min(100, Math.round((used / allocated) * 100)) : 0;

  const size = 120;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-6 shadow-lg flex items-center gap-6 text-white">
      <svg width={size} height={size} className="flex-none">
        <defs>
          <linearGradient id="storageGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size/2}, ${size/2})`}>
          <circle 
            r={radius} 
            fill="transparent" 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth={stroke} 
          />
          <circle
            r={radius}
            fill="transparent"
            stroke="url(#storageGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90)`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </g>
        <text
          x={size/2}
          y={size/2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-white"
          style={{ fontSize: '24px', fontWeight: 'bold' }}
        >
          {percent}%
        </text>
      </svg>

      <div className="flex-1">
        <div className="text-sm text-red-100 mb-1">Available Storage</div>
        <div className="text-2xl font-bold mb-1">{niceBytes(allocated - used)} / {niceBytes(allocated)}</div>
        <div className="text-sm text-red-100 opacity-90">{percent}% Space used</div>
      </div>
    </div>
  );
}
