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

  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4 max-w-[322px] mb-[2rem] mt-[1rem]">
      <svg width={size} height={size} className="flex-none">
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size/2}, ${size/2})`}>
          <circle r={radius} fill="transparent" stroke="#eef2f7" strokeWidth={stroke} />
          <circle
            r={radius}
            fill="transparent"
            stroke="url(#g1)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90)`}
          />
        </g>
      </svg>

      <div>
        <div className="text-xs text-gray-500">Available Storage</div>
        <div className="text-lg font-semibold">{niceBytes(allocated - used)} <span className="text-sm text-gray-500">left</span></div>
        <div className="text-sm text-gray-500 mt-1">{percent}% used • {niceBytes(used)} / {niceBytes(allocated)}</div>
      </div>
    </div>
  );
}
