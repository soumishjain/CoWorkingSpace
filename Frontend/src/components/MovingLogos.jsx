import React from "react";

const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
];

export default function MovingLogos() {
  return (
    <div className="mt-20 overflow-hidden">

      {/* 🔥 TITLE */}
      <p className="text-center text-sm text-[var(--text-secondary)] mb-8">
        Trusted by teams worldwide
      </p>

      <div className="relative">

        {/* 🔥 LEFT FADE */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 
                        bg-gradient-to-r from-[var(--bg-main)] to-transparent" />

        {/* 🔥 RIGHT FADE */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 
                        bg-gradient-to-l from-[var(--bg-main)] to-transparent" />

        {/* 🔥 TRACK (DOUBLE FOR INFINITE LOOP) */}
        <div className="flex gap-16 w-max animate-marquee">

          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center 
                         min-w-[120px] h-[60px] 
                         opacity-70 hover:opacity-100 
                         transition duration-300"
            >
              <img
                src={logo}
                alt="logo"
                className="h-10 object-contain 
                           grayscale-0 brightness-100 
                           transition duration-300"
              />
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}