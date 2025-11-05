import React, { forwardRef } from "react";

const VideoView = forwardRef(({ label, muted = false }, ref) => (
  <div className="flex flex-col items-center">
    <video
      ref={ref}
      autoPlay
      muted={muted}
      playsInline
      className="rounded-2xl border-2 border-gray-700 shadow-lg w-72 h-48 "
    />
    <p className="mt-2 text-gray-300">{label}</p>
  </div>
));

export default VideoView;
