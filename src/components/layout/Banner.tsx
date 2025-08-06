import React from "react";

import LocaleSwitcher from "./LocaleSwitcher";

const Banner = () => {
  return (
    <div className="w-full h-9 text-white bg-[#d1aa5c]">
      <div className="w-full max-w-6xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm px-2 border-r border-l border-white">
            +90 545 218 5304
          </p>
          <p className="text-sm px-2 border-r border-white">
            angoragumus@gmail.com
          </p>
        </div>
        <LocaleSwitcher />
      </div>
    </div>
  );
};

export default Banner;
