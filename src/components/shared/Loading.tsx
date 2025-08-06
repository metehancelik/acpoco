import React from "react";
import { ClockLoader } from "react-spinners";

const Loading = ({ size = 50 }: { size?: number }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClockLoader size={size} color="#e8702a" />
    </div>
  );
};

export default Loading;
